import type { GoalPeriod, SalesEntry } from '../types'

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getPeriodLabel(period: GoalPeriod): string {
  const labels: Record<GoalPeriod, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  }
  return labels[period]
}

export function getDateRangeForPeriod(
  period: GoalPeriod,
  startDate: string
): { from: Date; to: Date } {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  let end: Date

  if (period === 'daily') {
    end = new Date(start)
    end.setHours(23, 59, 59, 999)
  } else if (period === 'weekly') {
    end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
  } else {
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)
  }

  return { from: start, to: end }
}

export function calculateActualSales(
  entries: SalesEntry[],
  associateId: string,
  period: GoalPeriod,
  startDate: string
): number {
  const { from, to } = getDateRangeForPeriod(period, startDate)
  return entries
    .filter((e) => {
      if (e.associateId !== associateId) return false
      const d = new Date(e.date)
      return d >= from && d <= to
    })
    .reduce((sum, e) => sum + e.amount, 0)
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-red-400'
}

export function getProgressTextColor(percentage: number): string {
  if (percentage >= 100) return 'text-green-600'
  if (percentage >= 75) return 'text-blue-600'
  if (percentage >= 50) return 'text-yellow-600'
  return 'text-red-500'
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
