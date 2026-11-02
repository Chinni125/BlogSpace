import { useState } from 'react'

const IMAGE_URL = 'https://plus.unsplash.com/premium_photo-1792760270482-e14abda37d2f?auto=format&fit=max&w=1920&q=80'

export default function HomeBanner() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section className="my-8 overflow-hidden rounded-xl border border-line bg-white shadow-sm" aria-label="Featured story banner">
      {!imageFailed ? (
        <img
          className="block h-auto w-full object-contain"
          src={IMAGE_URL}
          alt="A welcoming view that sets the scene for stories worth sharing"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex min-h-40 items-center justify-center bg-[#f0ece4] px-6 py-10 text-center text-muted sm:min-h-56" role="img" aria-label="Featured stories">
          <p className="font-serif text-xl sm:text-2xl">Stories worth sharing</p>
        </div>
      )}
    </section>
  )
}
