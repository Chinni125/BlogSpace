import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../services/api'
import Layout from '../components/Layout'
import Alert from '../components/Alert'
import { btnPrimary } from '../components/ui'

export default function CreatePost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', image: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  function onImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Choose a JPEG, PNG, GIF, or WebP image smaller than 5 MB' })
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, image: reader.result })
    reader.onerror = () => setErrors({ ...errors, image: 'Could not read this image' })
    reader.readAsDataURL(file)
    setErrors({ ...errors, image: '' })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setFormError('')
    const v = {}
    if (form.title.trim().length < 3) v.title = 'Title must be at least 3 characters'
    if (form.content.trim().length < 10) v.content = 'Story must be at least 10 characters'
    if (!form.image) v.image = 'Choose an image for your story'
    setErrors(v)
    if (Object.keys(v).length) return
    setSubmitting(true)
    try {
      const d = await createPost(form)
      navigate(`/posts/${d.post.id}`, { state: { message: d.message } })
    } catch (err) {
      setErrors(err.fieldErrors || {})
      if (!err.fieldErrors || !Object.keys(err.fieldErrors).length) setFormError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Alert>{formError}</Alert>
        <div>
          <label htmlFor="title" className="sr-only">Title</label>
          <input
            id="title" name="title" value={form.title} onChange={onChange} maxLength={255} placeholder="Title"
            aria-invalid={!!errors.title}
            className="w-full border-0 border-b border-line bg-transparent pb-3 font-serif text-4xl font-bold tracking-tight outline-none placeholder:text-line focus:border-ink"
          />
          {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="content" className="sr-only">Story</label>
          <textarea
            id="content" name="content" rows={14} value={form.content} onChange={onChange} maxLength={20000}
            placeholder="Tell your story..." aria-invalid={!!errors.content}
            className="w-full resize-y border-0 bg-transparent font-serif text-xl leading-relaxed outline-none placeholder:text-line"
          />
          {errors.content && <p className="mt-1.5 text-sm text-red-600">{errors.content}</p>}
          <p className="mt-1 text-right text-xs text-muted">{form.content.length}/20000</p>
        </div>
        <div>
          <label htmlFor="image" className="mb-2 block text-sm font-medium">Story image</label>
          <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={onImageChange} aria-invalid={!!errors.image} />
          {errors.image && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors.image}</p>}
          {form.image && <img src={form.image} alt="Story preview" className="mt-3 max-h-72 rounded object-cover" />}
        </div>
        <button disabled={submitting} className={btnPrimary}>{submitting ? 'Publishing...' : 'Publish'}</button>
      </form>
    </Layout>
  )
}
