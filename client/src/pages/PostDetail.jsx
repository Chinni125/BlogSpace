import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchPost, deletePost } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatDate, getReadingTime } from '../utils'
import Layout from '../components/Layout'
import Alert from '../components/Alert'
import LikeButton from '../components/LikeButton'
import Comments from '../components/Comments'
import { EmptyState, ErrorState, Spinner } from '../components/ui'

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setError(''); setNotFound(false); setPost(null)
    fetchPost(id)
      .then((d) => setPost(d.post))
      .catch((e) => (e.status === 404 ? setNotFound(true) : setError(e.message || 'Could not load post')))
  }, [id])

  // Reload when the viewer changes (login/logout) so liked_by_me is accurate.
  useEffect(load, [load, user?.id])

  async function onDelete() {
    if (!window.confirm('Delete this story? This cannot be undone.')) return
    setDeleting(true); setActionError('')
    try {
      await deletePost(id)
      navigate('/')
    } catch (e) {
      setActionError(e.message)
      setDeleting(false)
    }
  }

  const isOwner = user && post && String(user.id) === String(post.user_id)

  return (
    <Layout>
      {notFound && <EmptyState title="Story not found" text="It may have been deleted." actionTo="/" actionLabel="Back to home" />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!post && !error && !notFound && <div className="flex justify-center py-20"><Spinner /></div>}

      {post && (
        <>
          <Alert type="success">{state?.message}</Alert>
          <Alert>{actionError}</Alert>
          <article className="mt-2">
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-3 text-sm font-medium text-muted">{getReadingTime(post.content)}</p>
            <div className="mt-6 flex items-center gap-3 border-b border-line pb-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-medium uppercase text-white" aria-hidden="true">{post.author_name[0]}</span>
              <div className="text-sm">
                <p className="font-medium">{post.author_name}</p>
                <p className="text-muted"><time dateTime={post.created_at}>{formatDate(post.created_at)}</time></p>
              </div>
              {isOwner && (
                <button onClick={onDelete} disabled={deleting} className="ml-auto text-sm text-red-600 hover:underline disabled:opacity-50">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
            <div className="mt-8 whitespace-pre-wrap break-words font-serif text-xl leading-[1.8]">{post.content}</div>
            <div className="mt-10 flex items-center gap-6 border-y border-line py-4">
              <LikeButton
                postId={post.id}
                liked={!!user && post.liked_by_me}
                count={post.like_count}
                onChange={(u) => setPost((p) => ({ ...p, liked_by_me: u.liked, like_count: u.like_count }))}
              />
              <span className="text-sm text-muted">💬 {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}</span>
            </div>
          </article>
          <Comments
            postId={post.id}
            onCountChange={(d) => setPost((p) => ({ ...p, comment_count: p.comment_count + d }))}
          />
          <Link to="/" className="mt-10 inline-block text-sm text-muted hover:text-ink">← All stories</Link>
        </>
      )}
    </Layout>
  )
}
