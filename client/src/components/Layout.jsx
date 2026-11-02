import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      <footer className="border-t border-line py-6 text-center text-sm text-muted">© {new Date().getFullYear()} BlogSpace</footer>
    </div>
  )
}
