import { query } from '../config/db.js'

export async function addComment({ userId, postId, content }) {
  const { rows } = await query(
    'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, postId, content]
  )
  return rows[0]
}

export async function listComments(postId) {
  const { rows } = await query(
    `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.username AS author_name
       FROM comments c JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1 ORDER BY c.created_at ASC`,
    [postId]
  )
  return rows
}

export async function getComment(id) {
  const { rows } = await query('SELECT id, user_id, post_id FROM comments WHERE id = $1', [id])
  return rows[0] || null
}

export async function getCommentWithAuthor(id) {
  const { rows } = await query(
    `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.username AS author_name
       FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = $1`,
    [id]
  )
  return rows[0] || null
}

export async function deleteComment(id, userId) {
  const { rowCount } = await query('DELETE FROM comments WHERE id = $1 AND user_id = $2', [id, userId])
  return rowCount === 1
}
