import { clamp } from '../utils'
import { getProgressColor } from '../utils'

interface ProgressBarProps {
  percentage: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({
  percentage,
  showLabel = true,
  size = 'md',
}: ProgressBarProps) {
  const clamped = clamp(percentage, 0, 100)
  const colorClass = getProgressColor(percentage)
  const heights: Record<string, string> = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
  const heightClass = heights[size]

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 mt-0.5 block text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
