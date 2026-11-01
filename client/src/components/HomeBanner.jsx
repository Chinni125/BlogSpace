import { useState } from 'react'

const bannerImage = 'https://plus.unsplash.com/premium_photo-1792760270482-e14abda37d2f?auto=format&fit=crop&w=2400&q=85'

export default function HomeBanner() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <figure className="mb-8 overflow-hidden rounded-2xl border border-line bg-[#eee9df] shadow-sm">
      {imageFailed ? (
        <div
          className="flex aspect-[3/2] w-full items-center justify-center px-6 text-center text-muted"
          role="img"
          aria-label="A peaceful coastal landscape"
        >
          <p className="max-w-sm font-serif text-xl">A moment of calm, while we get the picture back.</p>
        </div>
      ) : (
        <img
          src={bannerImage}
          alt="A traveler walking along a sunlit coastline"
          className="block h-auto w-full"
          width="2400"
          height="1600"
          fetchPriority="high"
          onError={() => setImageFailed(true)}
        />
      )}
    </figure>
  )
}
