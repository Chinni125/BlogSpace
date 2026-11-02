import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

test('document title uses the Blogspace brand', () => {
  assert.match(html, /<title>Blogspace<\/title>/)
})
