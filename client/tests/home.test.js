import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const homePage = await readFile(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8')

test('homepage displays the updated headline', () => {
  assert.match(homePage, /Stories that are meant to be heard\./)
  assert.doesNotMatch(homePage, /Stories worth sharing/)
})
