export default function FormField({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-md border bg-white px-3 py-2.5 outline-none transition focus:border-ink ${error ? 'border-red-500' : 'border-line'}`}
        {...props}
      />
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
