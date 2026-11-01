import { query } from '../config/db.js'

const SELECT = `
  SELECT p.id, p.title, p.content, p.created_at, p.user_id,
         u.username AS author_name,
         (SELECT COUNT(*)::int FROM likes    l WHERE l.post_id = p.id) AS like_count,
         (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p JOIN users u ON u.id = p.user_id`

export async function createPost({ userId, title, content }) {
  const { rows } = await query(
    'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id',
    [userId, title, content]
  )
  return getPostById(rows[0].id)
}

export async function listPosts({ limit = 20, offset = 0 } = {}) {
  const { rows } = await query(`${SELECT} ORDER BY p.created_at DESC, p.id DESC LIMIT $1 OFFSET $2`, [limit, offset])
  return rows
}

// viewerId (optional) adds liked_by_me for that user.
export async function getPostById(id, viewerId = null) {
  const { rows } = await query(
    `SELECT s.*, EXISTS (SELECT 1 FROM likes l WHERE l.post_id = s.id AND l.user_id = $2) AS liked_by_me
       FROM (${SELECT} WHERE p.id = $1) s`,
    [id, viewerId]
  )
  return rows[0] || null
}

// Deletes only if the post belongs to userId. Returns true if a row was deleted.
export async function deletePost(id, userId) {
  const { rowCount } = await query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [id, userId])
  return rowCount === 1
}
