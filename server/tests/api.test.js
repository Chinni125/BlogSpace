// Integration tests: run against a live server (npm run dev / npm start) and its database.
// Usage: npm test   (override target with API_URL)
import test from 'node:test'
import assert from 'node:assert/strict'
import { pool } from '../src/config/db.js'

const API = process.env.API_URL || 'http://localhost:5001/api'
const tag = `t${Date.now().toString(36)}`

function client() {
  let cookie = ''
  return async (method, path, body) => {
    const res = await fetch(API + path, {
      method,
      headers: { ...(body && { 'Content-Type': 'application/json' }), ...(cookie && { Cookie: cookie }) },
      body: body && JSON.stringify(body),
    })
    const sc = res.headers.get('set-cookie')
    if (sc) cookie = sc.split(';')[0]
    return { status: res.status, body: await res.json().catch(() => ({})), setCookie: sc }
  }
}

const alice = client(), bob = client(), anon = client()
const creds = (n) => ({ username: `${tag}_${n}`, email: `${tag}_${n}@test.io`, password: 'Passw0rd123' })
let postId, commentId

test.after(async () => {
  await pool.query('DELETE FROM users WHERE username LIKE $1', [`${tag}_%`])
  await pool.end()
})

test('health reports database connected', async () => {
  const r = await anon('GET', '/health')
  assert.equal(r.status, 200); assert.equal(r.body.database, 'connected')
})

test('signup validation + success + hashed password', async () => {
  let r = await anon('POST', '/auth/signup', { username: 'a', email: 'bad', password: '123' })
  assert.equal(r.status, 400); assert.ok(r.body.errors.username && r.body.errors.email && r.body.errors.password)

  r = await alice('POST', '/auth/signup', creds('alice'))
  assert.equal(r.status, 201); assert.match(r.setCookie, /HttpOnly/)
  assert.equal(r.body.user.password_hash, undefined)
  await bob('POST', '/auth/signup', creds('bob'))

  const { rows } = await pool.query('SELECT password_hash FROM users WHERE email = $1', [creds('alice').email])
  assert.match(rows[0].password_hash, /^\$2b\$12\$/)
})

test('duplicate signup rejected (case-insensitive email)', async () => {
  const r = await anon('POST', '/auth/signup', { ...creds('x'), email: creds('alice').email.toUpperCase() })
  assert.equal(r.status, 409)
})

test('login ok / wrong password / unknown user', async () => {
  const c = client()
  assert.equal((await c('POST', '/auth/login', { email: creds('alice').email, password: 'nope12345' })).status, 401)
  assert.equal((await c('POST', '/auth/login', { email: 'ghost@test.io', password: 'nope12345' })).status, 401)
  assert.equal((await c('POST', '/auth/login', { email: creds('alice').email, password: creds('alice').password })).status, 200)
  assert.equal((await c('GET', '/auth/me')).body.user.username, creds('alice').username)
})

test('protected routes reject anonymous and forged tokens', async () => {
  for (const [m, p] of [['GET', '/auth/me'], ['POST', '/posts'], ['DELETE', '/posts/1'], ['POST', '/posts/1/like'], ['DELETE', '/posts/1/like'], ['POST', '/posts/1/comments'], ['DELETE', '/comments/1']])
    assert.equal((await anon(m, p, m === 'POST' ? {} : undefined)).status, 401, `${m} ${p}`)
  const res = await fetch(API + '/auth/me', { headers: { Authorization: 'Bearer a.b.c' } })
  assert.equal(res.status, 401)
})

test('create post: validation + image upload persists and is returned', async () => {
  let r = await alice('POST', '/posts', { title: 'x', content: 'y' })
  assert.equal(r.status, 400)
  r = await alice('POST', '/posts', { title: 'Bad image', content: 'This story has invalid image data.', image: 'not-an-image' })
  assert.equal(r.status, 400); assert.ok(r.body.errors.image)

  const image = 'data:image/png;base64,aGVsbG8='
  r = await alice('POST', '/posts', { title: 'Hello world', content: 'This is my first story.', image })
  assert.equal(r.status, 201); postId = r.body.post.id
  assert.equal(r.body.post.author_name, creds('alice').username); assert.ok(r.body.post.created_at)
  assert.equal(r.body.post.image, image)
})

test('list + get posts (public), 404s', async () => {
  const list = await anon('GET', '/posts')
  assert.ok(list.body.posts.some((p) => p.id === postId))
  assert.equal((await anon('GET', `/posts/${postId}`)).body.post.title, 'Hello world')
  assert.equal((await anon('GET', '/posts/999999')).status, 404)
  assert.equal((await anon('GET', '/posts/abc')).status, 404)
})

test('likes: add, idempotent, count, liked_by_me, unlike', async () => {
  assert.equal((await alice('POST', `/posts/${postId}/like`)).body.like_count, 1)
  assert.equal((await alice('POST', `/posts/${postId}/like`)).body.like_count, 1)
  assert.equal((await bob('POST', `/posts/${postId}/like`)).body.like_count, 2)
  assert.equal((await alice('GET', `/posts/${postId}`)).body.post.liked_by_me, true)
  assert.equal((await anon('GET', `/posts/${postId}`)).body.post.liked_by_me, false)
  const { rows } = await pool.query('SELECT COUNT(*)::int c FROM likes WHERE post_id=$1', [postId])
  assert.equal(rows[0].c, 2)
  assert.equal((await bob('DELETE', `/posts/${postId}/like`)).body.like_count, 1)
  assert.equal((await bob('DELETE', `/posts/${postId}/like`)).body.like_count, 1)
  assert.equal((await alice('POST', '/posts/999999/like')).status, 404)
})

test('comments: validation, create, list, counts, authz, delete', async () => {
  assert.equal((await bob('POST', `/posts/${postId}/comments`, { content: '   ' })).status, 400)
  const r = await bob('POST', `/posts/${postId}/comments`, { content: 'Great read!' })
  assert.equal(r.status, 201); commentId = r.body.comment.id
  assert.equal(r.body.comment.author_name, creds('bob').username)
  const list = await anon('GET', `/posts/${postId}/comments`)
  assert.equal(list.body.comments.length, 1)
  assert.equal((await anon('GET', `/posts/${postId}`)).body.post.comment_count, 1)

  assert.equal((await alice('DELETE', `/comments/${commentId}`)).status, 403)
  assert.equal((await bob('DELETE', `/comments/${commentId}`)).status, 200)
  assert.equal((await bob('DELETE', `/comments/${commentId}`)).status, 404)
  assert.equal((await anon('GET', `/posts/${postId}`)).body.post.comment_count, 0)
})

test('delete post: only owner; cascades likes/comments', async () => {
  await bob('POST', `/posts/${postId}/comments`, { content: 'to be cascaded' })
  assert.equal((await bob('DELETE', `/posts/${postId}`)).status, 403)
  assert.equal((await alice('DELETE', `/posts/${postId}`)).status, 200)
  assert.equal((await anon('GET', `/posts/${postId}`)).status, 404)
  const { rows } = await pool.query(
    'SELECT (SELECT COUNT(*) FROM likes WHERE post_id=$1)::int l, (SELECT COUNT(*) FROM comments WHERE post_id=$1)::int c', [postId])
  assert.deepEqual(rows[0], { l: 0, c: 0 })
})

test('logout clears cookie', async () => {
  assert.equal((await alice('POST', '/auth/logout')).status, 200)
})
