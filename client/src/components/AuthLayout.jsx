import Layout from './Layout'

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <Layout>
      <div className="mx-auto max-w-sm py-6">
        <h1 className="text-center font-serif text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-center text-muted">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        <p className="mt-8 text-center text-sm text-muted">{footer}</p>
      </div>
    </Layout>
  )
}
