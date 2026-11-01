import { Link } from 'react-router-dom'

export const btnPrimary =
  'inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50'
export const btnGhost =
  'inline-flex items-center justify-center rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-ink disabled:opacity-50'

export function Spinner({ className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink ${className}`}
    />
  )
}

export function EmptyState({ title, text, actionTo, actionLabel }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-6 py-14 text-center">
      <p className="font-serif text-xl font-semibold">{title}</p>
      {text && <p className="mt-2 text-muted">{text}</p>}
      {actionTo && <Link to={actionTo} className={`${btnPrimary} mt-5`}>{actionLabel}</Link>}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry} className="mt-2 font-medium underline">Try again</button>}
    </div>
  )
}

export function PostSkeleton() {
  return (
    <div className="animate-pulse border-b border-line py-8" aria-hidden="true">
      <div className="h-3 w-40 rounded bg-line" />
      <div className="mt-4 h-6 w-3/4 rounded bg-line" />
      <div className="mt-3 h-4 w-full rounded bg-line" />
      <div className="mt-2 h-4 w-2/3 rounded bg-line" />
    </div>
  )
}
