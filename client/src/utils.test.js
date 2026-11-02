import test from 'node:test'
import assert from 'node:assert/strict'
import { getReadingTime } from './utils.js'

const words = (count) => Array(count).fill('word').join(' ')

test('getReadingTime returns at least one minute for empty and short content', () => {
  assert.equal(getReadingTime(''), '1 min read')
  assert.equal(getReadingTime('   '), '1 min read')
  assert.equal(getReadingTime(words(199)), '1 min read')
})

test('getReadingTime rounds up at 200 words per minute', () => {
  assert.equal(getReadingTime(words(200)), '1 min read')
  assert.equal(getReadingTime(words(201)), '2 min read')
  assert.equal(getReadingTime(words(400)), '2 min read')
  assert.equal(getReadingTime(words(401)), '3 min read')
})

test('getReadingTime derives the result from the current content', () => {
  const editedContent = words(200)
  assert.equal(getReadingTime(editedContent), '1 min read')
  assert.equal(getReadingTime(`${editedContent} additional`), '2 min read')
})
