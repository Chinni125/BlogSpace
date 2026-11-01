import { after, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { MemoryRouter } from 'react-router-dom'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { default: Home } = await vite.ssrLoadModule('/src/pages/Home.jsx')
const { AuthProvider } = await vite.ssrLoadModule('/src/context/AuthContext.jsx')

after(async () => vite.close())

describe('homepage banner', () => {
  it('renders the provided blogging banner image with alternative text', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null,
        createElement(AuthProvider, null, createElement(Home)),
      ),
    )

    assert.match(html, /<img[^>]+src="https:\/\/plus\.unsplash\.com\/premium_photo-1792760270482-e14abda37d2f/)
    assert.match(html, /alt="A scene to inspire your next story"/)
  })
})
