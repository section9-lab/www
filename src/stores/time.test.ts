import { describe, expect, it } from 'vitest'
import { getAmpm, getDateString, getHours, getIsNight, getMinutes } from './time'

describe('time helpers', () => {
  it('formats 12-hour time fragments correctly', () => {
    const morning = new Date(2026, 3, 9, 8, 5)
    const noon = new Date(2026, 3, 9, 12, 0)
    const midnight = new Date(2026, 3, 9, 0, 9)

    expect(getHours(morning)).toBe(8)
    expect(getMinutes(morning)).toBe('05')
    expect(getAmpm(morning)).toBe('am')

    expect(getHours(noon)).toBe(12)
    expect(getAmpm(noon)).toBe('pm')

    expect(getHours(midnight)).toBe(12)
    expect(getMinutes(midnight)).toBe('09')
    expect(getAmpm(midnight)).toBe('am')
  })

  it('detects night hours and returns a human date string', () => {
    const daytime = new Date(2026, 3, 9, 14, 30)
    const nighttime = new Date(2026, 3, 9, 22, 15)

    expect(getIsNight(daytime)).toBe(false)
    expect(getIsNight(nighttime)).toBe(true)
    expect(getDateString(daytime)).toContain('April')
    expect(getDateString(daytime)).toContain('9')
  })
})
