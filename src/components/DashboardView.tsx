import { useAppContext } from '../hooks/useAppContext'
import { ProgressBar } from './ProgressBar'
import { formatCurrency, getPeriodLabel } from '../utils'

interface DashboardViewProps {
  onSelectStore: (storeId: string) => void
}

export function DashboardView({ onSelectStore }: DashboardViewProps) {
  const { state, getStoreStats, getGoalProgress } = useAppContext()

  const allGoalProgresses = state.goals
    .map((g) => getGoalProgress(g.id))
    .filter(Boolean)

  const achievedGoals = allGoalProgresses.filter((p) => p!.isAchieved).length
  const totalGoals = allGoalProgresses.length

  const overallSales = allGoalProgresses.reduce(
    (sum, p) => sum + p!.actualSales,
    0
  )
  const overallTarget = state.goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const overallPct =
    overallTarget > 0 ? (overallSales / overallTarget) * 100 : 0

  const topPerformers = [...allGoalProgresses]
    .sort((a, b) => b!.percentage - a!.percentage)
    .slice(0, 5)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Overview of all stores and associates
        </p>
      </div>

      {state.stores.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl font-medium">Welcome to Sales Goal Tracker</p>
          <p className="text-sm mt-2">
            Start by adding a store, then add associates and set their goals.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Total Stores</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.stores.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Associates</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.associates.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Goals Achieved</p>
              <p className="text-2xl font-bold text-green-600">
                {achievedGoals}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  / {totalGoals}
                </span>
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Overall Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(overallPct)}%
              </p>
            </div>
          </div>

          {/* Overall Sales Progress */}
          {overallTarget > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Combined Sales Progress
              </h2>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{formatCurrency(overallSales)} actual</span>
                <span>{formatCurrency(overallTarget)} target</span>
              </div>
              <ProgressBar percentage={overallPct} size="lg" />
            </div>
          )}

          {/* Store Cards */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Stores
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {state.stores.map((store) => {
              const s = getStoreStats(store.id)
              if (!s) return null
              return (
                <button
                  key={store.id}
                  onClick={() => onSelectStore(store.id)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow text-left"
                >
                  <h3 className="font-semibold text-gray-900 mb-0.5">
                    {store.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    📍 {store.location}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{s.associateCount} associates</span>
                    <span>{Math.round(s.overallPercentage)}%</span>
                  </div>
                  <ProgressBar
                    percentage={s.overallPercentage}
                    showLabel={false}
                    size="sm"
                  />
                  {s.totalGoal > 0 && (
                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>{formatCurrency(s.totalSales)}</span>
                      <span>of {formatCurrency(s.totalGoal)}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Top Performing Goals
              </h2>
              <div className="space-y-4">
                {topPerformers.map((p) => {
                  if (!p) return null
                  return (
                    <div key={p.goal.id}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <div>
                          <span className="font-medium text-gray-800">
                            {p.associate.name}
                          </span>
                          <span className="text-gray-400 text-xs ml-1.5">
                            · {p.store.name} · {getPeriodLabel(p.goal.period)}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {formatCurrency(p.actualSales)} /{' '}
                          {formatCurrency(p.goal.targetAmount)}
                          {p.isAchieved && (
                            <span className="ml-1 text-green-500">✅</span>
                          )}
                        </span>
                      </div>
                      <ProgressBar percentage={p.percentage} size="sm" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
