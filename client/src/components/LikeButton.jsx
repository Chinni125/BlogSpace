import { useState } from 'react'
import { Link } from 'react-router-dom'
import { likePost, unlikePost } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LikeButton({ postId, liked, count, onChange }) {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    setBusy(true)
    setError('')
    try {
      const d = await (liked ? unlikePost(postId) : likePost(postId))
      onChange({ liked: d.liked, like_count: d.like_count }) // update UI from server response
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const label = `${count} ${count === 1 ? 'like' : 'likes'}`
  if (!user)
    return <span className="text-sm text-muted">♡ {label} · <Link to="/login" className="font-medium text-ink underline">Sign in to like</Link></span>

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={busy}
        aria-pressed={liked}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition disabled:opacity-60 ${liked ? 'border-ink bg-ink text-white' : 'border-line text-ink hover:border-ink'}`}
      >
        {liked ? '♥ Liked' : '♡ Like'} · {label}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  )
}
