export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

export const getReadingTime = (content = '') => {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`
}
