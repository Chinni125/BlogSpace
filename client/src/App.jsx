import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/posts/new" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
