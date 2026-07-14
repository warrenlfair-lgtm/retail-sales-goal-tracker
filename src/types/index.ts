export type GoalPeriod = 'daily' | 'weekly' | 'monthly'

export interface Store {
  id: string
  name: string
  location: string
  createdAt: string
}

export interface Associate {
  id: string
  storeId: string
  name: string
  role: string
  createdAt: string
}

export interface Goal {
  id: string
  associateId: string
  storeId: string
  period: GoalPeriod
  targetAmount: number
  startDate: string
  createdAt: string
}

export interface SalesEntry {
  id: string
  associateId: string
  storeId: string
  amount: number
  date: string
  note: string
  createdAt: string
}

export interface GoalProgress {
  goal: Goal
  associate: Associate
  store: Store
  actualSales: number
  percentage: number
  remaining: number
  isAchieved: boolean
}

export interface StoreStats {
  store: Store
  associateCount: number
  totalGoal: number
  totalSales: number
  overallPercentage: number
}

export type View =
  | 'dashboard'
  | 'stores'
  | 'store-detail'
  | 'associates'
  | 'goals'
  | 'sales'
