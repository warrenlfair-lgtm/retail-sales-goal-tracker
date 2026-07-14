import { useState } from 'react'
import { useAppContext } from '../hooks/useAppContext'
import { Modal } from './Modal'
import { ProgressBar } from './ProgressBar'
import { formatCurrency, getPeriodLabel } from '../utils'
import type { Associate, Goal, GoalPeriod } from '../types'

interface AssociateFormData {
  name: string
  role: string
}

interface GoalFormData {
  period: GoalPeriod
  targetAmount: string
  startDate: string
}

interface AssociateFormProps {
  storeId: string
  associate?: Associate
  onClose: () => void
}

function AssociateForm({ storeId, associate, onClose }: AssociateFormProps) {
  const { dispatch } = useAppContext()
  const [form, setForm] = useState<AssociateFormData>({
    name: associate?.name ?? '',
    role: associate?.role ?? '',
  })
  const [errors, setErrors] = useState<Partial<AssociateFormData>>({})

  function validate(): boolean {
    const errs: Partial<AssociateFormData> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.role.trim()) errs.role = 'Role is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (associate) {
      dispatch({ type: 'UPDATE_ASSOCIATE', payload: { ...associate, ...form } })
    } else {
      dispatch({ type: 'ADD_ASSOCIATE', payload: { storeId, ...form } })
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Jane Smith"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role / Title
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          placeholder="e.g. Sales Associate"
        />
        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {associate ? 'Save Changes' : 'Add Associate'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

interface GoalFormProps {
  storeId: string
  associateId: string
  goal?: Goal
  onClose: () => void
}

function GoalForm({ storeId, associateId, goal, onClose }: GoalFormProps) {
  const { dispatch } = useAppContext()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState<GoalFormData>({
    period: goal?.period ?? 'monthly',
    targetAmount: goal ? String(goal.targetAmount) : '',
    startDate: goal?.startDate ?? today,
  })
  const [errors, setErrors] = useState<Partial<GoalFormData>>({})

  function validate(): boolean {
    const errs: Partial<GoalFormData> = {}
    const amt = parseFloat(form.targetAmount)
    if (isNaN(amt) || amt <= 0) errs.targetAmount = 'Enter a positive amount'
    if (!form.startDate) errs.startDate = 'Start date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      storeId,
      associateId,
      period: form.period,
      targetAmount: parseFloat(form.targetAmount),
      startDate: form.startDate,
    }
    if (goal) {
      dispatch({ type: 'UPDATE_GOAL', payload: { ...goal, ...payload } })
    } else {
      dispatch({ type: 'ADD_GOAL', payload })
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Period
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.period}
          onChange={(e) =>
            setForm((f) => ({ ...f, period: e.target.value as GoalPeriod }))
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sales Target ($)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.targetAmount}
          onChange={(e) =>
            setForm((f) => ({ ...f, targetAmount: e.target.value }))
          }
          placeholder="e.g. 5000"
        />
        {errors.targetAmount && (
          <p className="text-red-500 text-xs mt-1">{errors.targetAmount}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.startDate}
          onChange={(e) =>
            setForm((f) => ({ ...f, startDate: e.target.value }))
          }
        />
        {errors.startDate && (
          <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {goal ? 'Save Changes' : 'Add Goal'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

interface SalesEntryFormProps {
  storeId: string
  associateId: string
  onClose: () => void
}

function SalesEntryForm({ storeId, associateId, onClose }: SalesEntryFormProps) {
  const { dispatch } = useAppContext()
  const today = new Date().toISOString().split('T')[0]
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [amtError, setAmtError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      setAmtError('Enter a positive amount')
      return
    }
    dispatch({
      type: 'ADD_SALES_ENTRY',
      payload: { storeId, associateId, amount: amt, date, note },
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sales Amount ($)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setAmtError('')
          }}
          placeholder="e.g. 1200"
        />
        {amtError && <p className="text-red-500 text-xs mt-1">{amtError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note (optional)
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Q3 promo sales"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Record Sales
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

interface StoreDetailViewProps {
  storeId: string
  onBack: () => void
}

export function StoreDetailView({ storeId, onBack }: StoreDetailViewProps) {
  const { state, dispatch, getAssociateGoals, getStoreStats } = useAppContext()
  const store = state.stores.find((s) => s.id === storeId)
  const associates = state.associates.filter((a) => a.storeId === storeId)
  const stats = getStoreStats(storeId)

  const [showAssocForm, setShowAssocForm] = useState(false)
  const [editAssoc, setEditAssoc] = useState<Associate | null>(null)
  const [deleteAssocConfirm, setDeleteAssocConfirm] = useState<string | null>(null)
  const [goalAssocId, setGoalAssocId] = useState<string | null>(null)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)
  const [deleteGoalConfirm, setDeleteGoalConfirm] = useState<string | null>(null)
  const [salesAssocId, setSalesAssocId] = useState<string | null>(null)
  const [expandedAssoc, setExpandedAssoc] = useState<string | null>(null)

  if (!store) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Store not found.</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline text-sm">
          ← Back to Stores
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        ← Back to Stores
      </button>

      {/* Store Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">📍 {store.location}</p>
          </div>
          {stats && (
            <div className="text-right text-sm">
              <p className="text-gray-500">{stats.associateCount} associate{stats.associateCount !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </div>

      {/* Associates */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Sales Associates</h2>
        <button
          onClick={() => setShowAssocForm(true)}
          className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Associate
        </button>
      </div>

      {associates.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-2">👤</div>
          <p className="text-sm">No associates yet. Add one to start tracking goals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {associates.map((assoc) => {
            const goals = getAssociateGoals(assoc.id)
            const isExpanded = expandedAssoc === assoc.id
            return (
              <div
                key={assoc.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Associate Header */}
                <div className="p-4 flex items-center justify-between">
                  <button
                    className="flex items-center gap-3 flex-1 text-left"
                    onClick={() =>
                      setExpandedAssoc(isExpanded ? null : assoc.id)
                    }
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                      {assoc.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{assoc.name}</p>
                      <p className="text-xs text-gray-500">{assoc.role}</p>
                    </div>
                    <span className="ml-2 text-gray-400 text-xs">
                      {goals.length} goal{goals.length !== 1 ? 's' : ''} {isExpanded ? '▲' : '▼'}
                    </span>
                  </button>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => setSalesAssocId(assoc.id)}
                      className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                    >
                      + Sales
                    </button>
                    <button
                      onClick={() => setGoalAssocId(assoc.id)}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      + Goal
                    </button>
                    <button
                      onClick={() => setEditAssoc(assoc)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={`Edit ${assoc.name}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteAssocConfirm(assoc.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${assoc.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Goals Section */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                    {goals.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-2">
                        No goals set. Click "+ Goal" to add one.
                      </p>
                    ) : (
                      goals.map((gp) => (
                        <div
                          key={gp.goal.id}
                          className="bg-white rounded-xl p-3 border border-gray-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                {getPeriodLabel(gp.goal.period)} Goal
                              </span>
                              <p className="text-xs text-gray-500">
                                From {gp.goal.startDate}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {gp.isAchieved && (
                                <span className="text-green-500 text-sm" title="Goal achieved!">
                                  ✅
                                </span>
                              )}
                              <button
                                onClick={() => setEditGoal(gp.goal)}
                                className="text-gray-400 hover:text-blue-600 text-xs"
                                aria-label="Edit goal"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setDeleteGoalConfirm(gp.goal.id)}
                                className="text-gray-400 hover:text-red-500 text-xs"
                                aria-label="Delete goal"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                            <span>
                              {formatCurrency(gp.actualSales)} /{' '}
                              {formatCurrency(gp.goal.targetAmount)}
                            </span>
                            {!gp.isAchieved && (
                              <span className="text-gray-400">
                                {formatCurrency(gp.remaining)} remaining
                              </span>
                            )}
                          </div>
                          <ProgressBar percentage={gp.percentage} size="sm" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {(showAssocForm || editAssoc) && (
        <Modal
          title={editAssoc ? 'Edit Associate' : 'Add Associate'}
          onClose={() => {
            setShowAssocForm(false)
            setEditAssoc(null)
          }}
        >
          <AssociateForm
            storeId={storeId}
            associate={editAssoc ?? undefined}
            onClose={() => {
              setShowAssocForm(false)
              setEditAssoc(null)
            }}
          />
        </Modal>
      )}

      {deleteAssocConfirm && (
        <Modal title="Delete Associate" onClose={() => setDeleteAssocConfirm(null)}>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure? All goals and sales entries for this associate will be removed.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                dispatch({ type: 'DELETE_ASSOCIATE', payload: deleteAssocConfirm })
                setDeleteAssocConfirm(null)
              }}
              className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteAssocConfirm(null)}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {goalAssocId && (
        <Modal title="Add Goal" onClose={() => setGoalAssocId(null)}>
          <GoalForm
            storeId={storeId}
            associateId={goalAssocId}
            onClose={() => setGoalAssocId(null)}
          />
        </Modal>
      )}

      {editGoal && (
        <Modal title="Edit Goal" onClose={() => setEditGoal(null)}>
          <GoalForm
            storeId={storeId}
            associateId={editGoal.associateId}
            goal={editGoal}
            onClose={() => setEditGoal(null)}
          />
        </Modal>
      )}

      {deleteGoalConfirm && (
        <Modal title="Delete Goal" onClose={() => setDeleteGoalConfirm(null)}>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this goal?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                dispatch({ type: 'DELETE_GOAL', payload: deleteGoalConfirm })
                setDeleteGoalConfirm(null)
              }}
              className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteGoalConfirm(null)}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {salesAssocId && (
        <Modal title="Record Sales" onClose={() => setSalesAssocId(null)}>
          <SalesEntryForm
            storeId={storeId}
            associateId={salesAssocId}
            onClose={() => setSalesAssocId(null)}
          />
        </Modal>
      )}
    </div>
  )
}
