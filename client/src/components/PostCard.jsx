import { Link } from 'react-router-dom'
import { formatDate } from '../utils'

export default function PostCard({ post }) {
  const excerpt = post.content.length > 200 ? post.content.slice(0, 200).trimEnd() + '…' : post.content
  const to = `/posts/${post.id}`
  return (
    <article className="border-b border-line py-8">
      <p className="flex items-center gap-2 text-sm">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-medium uppercase text-white" aria-hidden="true">
          {post.author_name[0]}
        </span>
        <span className="font-medium">{post.author_name}</span>
      </p>
      <Link to={to} className="group mt-3 block">
        {post.image && <img src={post.image} alt="" className="mb-4 max-h-64 w-full rounded object-cover" />}
        <h2 className="font-serif text-2xl font-bold leading-snug tracking-tight group-hover:underline">{post.title}</h2>
        <p className="mt-2 line-clamp-3 break-words font-serif text-lg leading-relaxed text-muted">{excerpt}</p>
      </Link>
      <p className="mt-4 flex items-center gap-4 text-sm text-muted">
        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        <span aria-label={`${post.like_count} likes`}>♥ {post.like_count}</span>
        <span aria-label={`${post.comment_count} comments`}>💬 {post.comment_count}</span>
      </p>
    </article>
  )
}
