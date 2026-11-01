import { getPostById } from '../models/posts.js'
import { addLike, removeLike, countLikes } from '../models/likes.js'
import { addComment, listComments, getComment, getCommentWithAuthor, deleteComment } from '../models/comments.js'

const parseId = (v) => (/^\d{1,15}$/.test(v) ? v : null)

async function postExists(req, res) {
  const id = parseId(req.params.id)
  if (!id || !(await getPostById(id))) {
    res.status(404).json({ error: 'Post not found' })
    return null
  }
  return id
}

// Idempotent: liking twice leaves exactly one like (DB unique constraint + ON CONFLICT).
export async function like(req, res, next) {
  try {
    const id = await postExists(req, res)
    if (!id) return
    await addLike(req.user.id, id)
    res.json({ liked: true, like_count: await countLikes(id) })
  } catch (e) { next(e) }
}

export async function unlike(req, res, next) {
  try {
    const id = await postExists(req, res)
    if (!id) return
    await removeLike(req.user.id, id)
    res.json({ liked: false, like_count: await countLikes(id) })
  } catch (e) { next(e) }
}

export async function getComments(req, res, next) {
  try {
    const id = await postExists(req, res)
    if (!id) return
    res.json({ comments: await listComments(id) })
  } catch (e) { next(e) }
}

export async function createComment(req, res, next) {
  try {
    const id = await postExists(req, res)
    if (!id) return
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : ''
    if (content.length < 1 || content.length > 2000)
      return res.status(400).json({ error: 'Validation failed', errors: { content: 'Comment must be 1-2000 characters' } })
    const created = await addComment({ userId: req.user.id, postId: id, content })
    res.status(201).json({ message: 'Comment added', comment: await getCommentWithAuthor(created.id) })
  } catch (e) { next(e) }
}

export async function removeComment(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const comment = id && (await getComment(id))
    if (!comment) return res.status(404).json({ error: 'Comment not found' })
    if (String(comment.user_id) !== String(req.user.id))
      return res.status(403).json({ error: 'You can only delete your own comments' })
    await deleteComment(id, req.user.id)
    res.json({ message: 'Comment deleted' })
  } catch (e) { next(e) }
}
