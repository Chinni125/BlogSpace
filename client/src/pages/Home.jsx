import { useCallback, useEffect, useState } from 'react'
import { fetchPosts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import { EmptyState, ErrorState, PostSkeleton } from '../components/ui'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setError('')
    setPosts(null)
    fetchPosts().then((d) => setPosts(d.posts)).catch((e) => setError(e.message || 'Could not load posts'))
  }, [])

  useEffect(load, [load])

  return (
    <Layout>
      <header className="mb-2 border-b border-line pb-8">
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">Stories worth sharing</h1>
        <p className="mt-3 text-lg text-muted">Read what the community is writing — or write your own.</p>
      </header>

      {error && <ErrorState message={error} onRetry={load} />}
      {!posts && !error && <div aria-busy="true"><PostSkeleton /><PostSkeleton /><PostSkeleton /></div>}
      {posts?.length === 0 && (
        <>
          <img
            src="https://images.unsplash.com/photo-1792980205896-4bc34b91b040?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            alt=""
            className="mb-6 h-56 w-full rounded-lg object-cover sm:h-72"
          />
          <EmptyState
            title="No stories yet"
            text="Be the first to publish something."
            actionTo={user ? '/posts/new' : '/signup'}
            actionLabel={user ? 'Write a story' : 'Get started'}
          />
        </>
      )}
      {posts?.map((p) => <PostCard key={p.id} post={p} />)}
    </Layout>
  )
}
