import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('BlogMake is used as the document and in-app brand', () => {
  const html = read('../index.html')
  const appBranding = [
    '../src/components/Navbar.jsx',
    '../src/components/Layout.jsx',
    '../src/pages/Login.jsx',
    '../src/pages/Signup.jsx',
  ].map(read).join('\n')

  assert.match(html, /<title>BlogMake<\/title>/)
  assert.match(html, /BlogMake — share your stories with the world\./)
  assert.match(appBranding, /BlogMake/)
  assert.doesNotMatch(`${html}\n${appBranding}`, /BlogSpace/)
})
