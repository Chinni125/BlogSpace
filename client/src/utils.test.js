import test from 'node:test'
import assert from 'node:assert/strict'
import { getReadingTime } from './utils.js'

const words = (count) => Array.from({ length: count }, (_, index) => `word${index}`).join(' ')

test('reading time rounds up at 200 words per minute and has a one-minute minimum', () => {
  assert.equal(getReadingTime(''), 1)
  assert.equal(getReadingTime('  a   few words  '), 1)
  assert.equal(getReadingTime(words(199)), 1)
  assert.equal(getReadingTime(words(200)), 1)
  assert.equal(getReadingTime(words(201)), 2)
  assert.equal(getReadingTime(words(400)), 2)
  assert.equal(getReadingTime(words(401)), 3)
})

test('reading time is recalculated from the current content', () => {
  let content = words(200)
  assert.equal(getReadingTime(content), 1)
  content = `${content} ${words(1)}`
  assert.equal(getReadingTime(content), 2)
  content = 'edited'
  assert.equal(getReadingTime(content), 1)
})
