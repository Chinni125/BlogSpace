import { query } from '../config/db.js'

// Returns true if a like was created, false if it already existed.
export async function addLike(userId, postId) {
  const { rowCount } = await query(
    `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)
     ON CONFLICT (user_id, post_id) DO NOTHING`,
    [userId, postId]
  )
  return rowCount === 1
}

export async function removeLike(userId, postId) {
  const { rowCount } = await query(
    'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
    [userId, postId]
  )
  return rowCount === 1
}

export async function countLikes(postId) {
  const { rows } = await query(
    'SELECT COUNT(*)::int AS count FROM likes WHERE post_id = $1',
    [postId]
  )
  return rows[0].count
}
