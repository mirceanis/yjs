/**
 * Isomorphic module for true random numbers / buffers / uuids.
 *
 * Attention: falls back to Math.random if the browser does not support crypto.
 *
 * @module random
 */

import * as math from './math.js'
import * as binary from './binary.js'

export const rand = Math.random

// @ts-ignore
function getRandomValues(buffer) {
  // Only typed arrays supported
  if (
    !buffer ||
    typeof buffer.BYTES_PER_ELEMENT !== 'number' ||
    typeof buffer.length !== 'number'
  ) {
    throw new TypeError('Expected a TypedArray')
  }

  // Number of bits per element
  const bits = buffer.BYTES_PER_ELEMENT * 8
  const range = Math.pow(2, bits)

  for (let i = 0; i < buffer.length; i++) {
    // Fill each slot with 0 <= value < range
    buffer[i] = Math.floor(Math.random() * range)
  }
  return buffer
}

export const uint32 = () => getRandomValues(new Uint32Array(1))[0]

export const uint53 = () => {
  const arr = getRandomValues(new Uint32Array(8))
  return (arr[0] & binary.BITS21) * (binary.BITS32 + 1) + (arr[1] >>> 0)
}

/**
 * @template T
 * @param {Array<T>} arr
 * @return {T}
 */
export const oneOf = arr => arr[math.floor(rand() * arr.length)]

// @ts-ignore
const uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11

/**
 * @return {string}
 */
export const uuidv4 = () => uuidv4Template.replace(/[018]/g, /** @param {number} c */ c =>
  (c ^ uint32() & 15 >> c / 4).toString(16)
)
