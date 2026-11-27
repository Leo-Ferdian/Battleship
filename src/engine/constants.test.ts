import { describe, expect, it } from 'vitest'
import { BOARD_SIZE } from './constants'

describe('constants', () => {
  it('uses a 10x10 board', () => {
    expect(BOARD_SIZE).toBe(10)
  })
})
