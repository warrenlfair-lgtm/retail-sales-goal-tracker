import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  getPeriodLabel,
  getDateRangeForPeriod,
  calculateActualSales,
  getProgressColor,
  clamp,
  generateId,
} from '../utils'
import type { SalesEntry } from '../types'

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it('returns a non-empty string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})

describe('formatCurrency', () => {
  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('formats whole numbers without decimals', () => {
    expect(formatCurrency(5000)).toBe('$5,000')
  })

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })
})

describe('getPeriodLabel', () => {
  it('returns Daily for daily', () => {
    expect(getPeriodLabel('daily')).toBe('Daily')
  })

  it('returns Weekly for weekly', () => {
    expect(getPeriodLabel('weekly')).toBe('Weekly')
  })

  it('returns Monthly for monthly', () => {
    expect(getPeriodLabel('monthly')).toBe('Monthly')
  })
})

describe('getDateRangeForPeriod', () => {
  it('returns same day range for daily', () => {
    const { from, to } = getDateRangeForPeriod('daily', '2024-06-15')
    expect(from.toDateString()).toBe(to.toDateString())
  })

  it('returns 7-day range for weekly', () => {
    const { from, to } = getDateRangeForPeriod('weekly', '2024-06-10')
    const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    // Weekly range: start of day 0 to end of day 6 → ~6.9999... days difference
    expect(Math.floor(diffDays)).toBe(6)
  })

  it('returns end of month for monthly', () => {
    const { from, to } = getDateRangeForPeriod('monthly', '2024-06-01')
    expect(from.getDate()).toBe(1)
    expect(to.getDate()).toBe(30) // June has 30 days
  })
})

describe('calculateActualSales', () => {
  const entries: SalesEntry[] = [
    {
      id: '1',
      associateId: 'a1',
      storeId: 's1',
      amount: 500,
      date: '2024-06-15',
      note: '',
      createdAt: '2024-06-15T00:00:00Z',
    },
    {
      id: '2',
      associateId: 'a1',
      storeId: 's1',
      amount: 300,
      date: '2024-06-20',
      note: '',
      createdAt: '2024-06-20T00:00:00Z',
    },
    {
      id: '3',
      associateId: 'a2',
      storeId: 's1',
      amount: 1000,
      date: '2024-06-15',
      note: '',
      createdAt: '2024-06-15T00:00:00Z',
    },
  ]

  it('sums sales for the correct associate within monthly period', () => {
    const total = calculateActualSales(entries, 'a1', 'monthly', '2024-06-01')
    expect(total).toBe(800)
  })

  it('excludes other associates', () => {
    const total = calculateActualSales(entries, 'a2', 'monthly', '2024-06-01')
    expect(total).toBe(1000)
  })

  it('returns 0 when no entries match', () => {
    const total = calculateActualSales(entries, 'a3', 'monthly', '2024-06-01')
    expect(total).toBe(0)
  })

  it('filters by daily period', () => {
    const total = calculateActualSales(entries, 'a1', 'daily', '2024-06-15')
    expect(total).toBe(500)
  })

  it('excludes entries outside the period', () => {
    const total = calculateActualSales(entries, 'a1', 'daily', '2024-06-16')
    expect(total).toBe(0)
  })
})

describe('getProgressColor', () => {
  it('returns green for 100%', () => {
    expect(getProgressColor(100)).toBe('bg-green-500')
  })

  it('returns blue for 75-99%', () => {
    expect(getProgressColor(80)).toBe('bg-blue-500')
    expect(getProgressColor(75)).toBe('bg-blue-500')
  })

  it('returns yellow for 50-74%', () => {
    expect(getProgressColor(60)).toBe('bg-yellow-500')
    expect(getProgressColor(50)).toBe('bg-yellow-500')
  })

  it('returns red for below 50%', () => {
    expect(getProgressColor(30)).toBe('bg-red-400')
    expect(getProgressColor(0)).toBe('bg-red-400')
  })

  it('returns green for over 100%', () => {
    expect(getProgressColor(120)).toBe('bg-green-500')
  })
})

describe('clamp', () => {
  it('returns value within range', () => {
    expect(clamp(50, 0, 100)).toBe(50)
  })

  it('clamps to min', () => {
    expect(clamp(-5, 0, 100)).toBe(0)
  })

  it('clamps to max', () => {
    expect(clamp(200, 0, 100)).toBe(100)
  })
})
