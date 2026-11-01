import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchComments, addComment, deleteComment } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils'
import Alert from './Alert'
import { btnPrimary, Spinner } from './ui'

export default function Comments({ postId, onCountChange }) {
  const { user } = useAuth()
  const [comments, setComments] = useState(null)
  const [text, setText] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments(postId).then((d) => setComments(d.comments)).catch((e) => setError(e.message))
  }, [postId])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!text.trim()) return setFieldError('Comment cannot be empty')
    setFieldError('')
    setSubmitting(true)
    try {
      const d = await addComment(postId, text)
      setComments((c) => [...c, d.comment])
      onCountChange(1)
      setText('')
    } catch (err) {
      setFieldError(err.fieldErrors?.content || '')
      if (!err.fieldErrors?.content) setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this comment?')) return
    setError('')
    try {
      await deleteComment(id)
      setComments((c) => c.filter((x) => x.id !== id))
      onCountChange(-1)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="mt-10" aria-label="Comments">
      <h2 className="mb-5 font-serif text-2xl font-bold">Comments{comments ? ` (${comments.length})` : ''}</h2>
      <Alert>{error}</Alert>

      {user ? (
        <form onSubmit={onSubmit} noValidate className="mb-6 space-y-2">
          <textarea
            value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={2000} placeholder="Write a comment..."
            aria-label="Comment"
            className={`w-full rounded-md border bg-white px-3 py-2.5 outline-none focus:border-ink ${fieldError ? 'border-red-500' : 'border-line'}`}
          />
          {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}
          <button disabled={submitting} className={btnPrimary}>
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted">
          <Link to="/login" className="font-medium text-ink underline">Sign in</Link> to join the conversation.
        </p>
      )}

      {!comments && !error && <Spinner />}
      {comments?.length === 0 && <p className="text-muted">No comments yet — start the conversation.</p>}
      <ul className="space-y-3">
        {comments?.map((c) => (
          <li key={c.id} className="border-b border-line pb-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-muted"><span className="font-medium text-ink">{c.author_name}</span> · {formatDate(c.created_at)}</p>
              {user && String(user.id) === String(c.user_id) && (
                <button onClick={() => onDelete(c.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              )}
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-ink">{c.content}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
