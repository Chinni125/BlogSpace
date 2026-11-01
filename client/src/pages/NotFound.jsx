import Layout from '../components/Layout'
import { EmptyState } from '../components/ui'

export default function NotFound() {
  return <Layout><EmptyState title="Page not found" text="The page you're looking for doesn't exist." actionTo="/" actionLabel="Back to home" /></Layout>
}
