import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'
import type {
  Store,
  Associate,
  Goal,
  SalesEntry,
  GoalProgress,
  StoreStats,
} from '../types'
import {
  generateId,
  calculateActualSales,
  clamp,
} from '../utils'

interface AppState {
  stores: Store[]
  associates: Associate[]
  goals: Goal[]
  salesEntries: SalesEntry[]
}

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_STORE'; payload: Omit<Store, 'id' | 'createdAt'> }
  | { type: 'UPDATE_STORE'; payload: Store }
  | { type: 'DELETE_STORE'; payload: string }
  | { type: 'ADD_ASSOCIATE'; payload: Omit<Associate, 'id' | 'createdAt'> }
  | { type: 'UPDATE_ASSOCIATE'; payload: Associate }
  | { type: 'DELETE_ASSOCIATE'; payload: string }
  | { type: 'ADD_GOAL'; payload: Omit<Goal, 'id' | 'createdAt'> }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_SALES_ENTRY'; payload: Omit<SalesEntry, 'id' | 'createdAt'> }
  | { type: 'UPDATE_SALES_ENTRY'; payload: SalesEntry }
  | { type: 'DELETE_SALES_ENTRY'; payload: string }

const initialState: AppState = {
  stores: [],
  associates: [],
  goals: [],
  salesEntries: [],
}

function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString()
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload

    case 'ADD_STORE':
      return {
        ...state,
        stores: [
          ...state.stores,
          { ...action.payload, id: generateId(), createdAt: now },
        ],
      }
    case 'UPDATE_STORE':
      return {
        ...state,
        stores: state.stores.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      }
    case 'DELETE_STORE': {
      const storeId = action.payload
      const associateIds = state.associates
        .filter((a) => a.storeId === storeId)
        .map((a) => a.id)
      return {
        ...state,
        stores: state.stores.filter((s) => s.id !== storeId),
        associates: state.associates.filter((a) => a.storeId !== storeId),
        goals: state.goals.filter(
          (g) =>
            g.storeId !== storeId && !associateIds.includes(g.associateId)
        ),
        salesEntries: state.salesEntries.filter(
          (e) =>
            e.storeId !== storeId && !associateIds.includes(e.associateId)
        ),
      }
    }

    case 'ADD_ASSOCIATE':
      return {
        ...state,
        associates: [
          ...state.associates,
          { ...action.payload, id: generateId(), createdAt: now },
        ],
      }
    case 'UPDATE_ASSOCIATE':
      return {
        ...state,
        associates: state.associates.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      }
    case 'DELETE_ASSOCIATE': {
      const assocId = action.payload
      return {
        ...state,
        associates: state.associates.filter((a) => a.id !== assocId),
        goals: state.goals.filter((g) => g.associateId !== assocId),
        salesEntries: state.salesEntries.filter(
          (e) => e.associateId !== assocId
        ),
      }
    }

    case 'ADD_GOAL':
      return {
        ...state,
        goals: [
          ...state.goals,
          { ...action.payload, id: generateId(), createdAt: now },
        ],
      }
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      }
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      }

    case 'ADD_SALES_ENTRY':
      return {
        ...state,
        salesEntries: [
          ...state.salesEntries,
          { ...action.payload, id: generateId(), createdAt: now },
        ],
      }
    case 'UPDATE_SALES_ENTRY':
      return {
        ...state,
        salesEntries: state.salesEntries.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      }
    case 'DELETE_SALES_ENTRY':
      return {
        ...state,
        salesEntries: state.salesEntries.filter(
          (e) => e.id !== action.payload
        ),
      }

    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  getGoalProgress: (goalId: string) => GoalProgress | null
  getStoreStats: (storeId: string) => StoreStats | null
  getAssociateGoals: (associateId: string) => GoalProgress[]
}

const AppContext = createContext<AppContextValue | null>(null)

const STORAGE_KEY = 'retail-sales-tracker-data'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AppState
        dispatch({ type: 'LOAD_STATE', payload: parsed })
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function getGoalProgress(goalId: string): GoalProgress | null {
    const goal = state.goals.find((g) => g.id === goalId)
    if (!goal) return null
    const associate = state.associates.find(
      (a) => a.id === goal.associateId
    )
    if (!associate) return null
    const store = state.stores.find((s) => s.id === goal.storeId)
    if (!store) return null

    const actualSales = calculateActualSales(
      state.salesEntries,
      goal.associateId,
      goal.period,
      goal.startDate
    )
    const percentage = clamp(
      goal.targetAmount > 0 ? (actualSales / goal.targetAmount) * 100 : 0,
      0,
      999
    )
    const remaining = Math.max(0, goal.targetAmount - actualSales)
    return {
      goal,
      associate,
      store,
      actualSales,
      percentage,
      remaining,
      isAchieved: actualSales >= goal.targetAmount,
    }
  }

  function getStoreStats(storeId: string): StoreStats | null {
    const store = state.stores.find((s) => s.id === storeId)
    if (!store) return null
    const associates = state.associates.filter((a) => a.storeId === storeId)
    const storeGoals = state.goals.filter((g) => g.storeId === storeId)
    const totalGoal = storeGoals.reduce((sum, g) => sum + g.targetAmount, 0)
    const totalSales = storeGoals.reduce((sum, g) => {
      const progress = getGoalProgress(g.id)
      return sum + (progress?.actualSales ?? 0)
    }, 0)
    const overallPercentage = totalGoal > 0 ? (totalSales / totalGoal) * 100 : 0
    return {
      store,
      associateCount: associates.length,
      totalGoal,
      totalSales,
      overallPercentage: clamp(overallPercentage, 0, 999),
    }
  }

  function getAssociateGoals(associateId: string): GoalProgress[] {
    return state.goals
      .filter((g) => g.associateId === associateId)
      .map((g) => getGoalProgress(g.id))
      .filter((p): p is GoalProgress => p !== null)
  }

  return (
    <AppContext.Provider
      value={{ state, dispatch, getGoalProgress, getStoreStats, getAssociateGoals }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
