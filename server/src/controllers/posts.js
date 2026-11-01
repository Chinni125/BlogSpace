import { createPost, listPosts, getPostById, deletePost } from '../models/posts.js'

const parseId = (v) => (/^\d{1,15}$/.test(v) ? v : null)

export async function getPosts(req, res, next) {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50)
    const offset = Math.max(parseInt(req.query.offset) || 0, 0)
    res.json({ posts: await listPosts({ limit, offset }) })
  } catch (e) { next(e) }
}

export async function getPost(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const post = id && (await getPostById(id, req.user?.id ?? null))
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json({ post })
  } catch (e) { next(e) }
}

export async function create(req, res, next) {
  try {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : ''
    const image = typeof req.body?.image === 'string' ? req.body.image : ''
    const errors = {}
    if (title.length < 3 || title.length > 255) errors.title = 'Title must be 3-255 characters'
    if (content.length < 10 || content.length > 20000) errors.content = 'Content must be 10-20000 characters'
    if (!image) errors.image = 'Choose an image for your story'
    else if (!/^data:image\/(?:jpeg|png|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image) || image.length > 7_000_000)
      errors.image = 'Choose a valid image smaller than 5 MB'
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors })

    const post = await createPost({ userId: req.user.id, title, content, image })
    res.status(201).json({ message: 'Post published', post })
  } catch (e) { next(e) }
}

export async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const post = id && (await getPostById(id))
    if (!post) return res.status(404).json({ error: 'Post not found' })
    if (String(post.user_id) !== String(req.user.id))
      return res.status(403).json({ error: 'You can only delete your own posts' })
    await deletePost(id, req.user.id)
    res.json({ message: 'Post deleted' })
  } catch (e) { next(e) }
}
