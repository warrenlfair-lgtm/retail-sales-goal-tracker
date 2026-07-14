import { useState } from 'react'
import { AppProvider } from './hooks/useAppContext'
import { DashboardView } from './components/DashboardView'
import { StoresView } from './components/StoresView'
import { StoreDetailView } from './components/StoreDetailView'
import type { View } from './types'

function AppContent() {
  const [view, setView] = useState<View>('dashboard')
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)

  function handleSelectStore(storeId: string) {
    setSelectedStoreId(storeId)
    setView('store-detail')
  }

  function handleBackToStores() {
    setView('stores')
    setSelectedStoreId(null)
  }

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'stores', label: 'Stores', icon: '🏪' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              Retail Sales Tracker
            </span>
          </div>
          <nav className="flex gap-1">
            {navItems.map((item) => {
              const isActive =
                view === item.id ||
                (item.id === 'stores' && view === 'store-detail')
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id)
                    setSelectedStoreId(null)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {view === 'dashboard' && (
          <DashboardView onSelectStore={handleSelectStore} />
        )}
        {view === 'stores' && (
          <StoresView onSelectStore={handleSelectStore} />
        )}
        {view === 'store-detail' && selectedStoreId && (
          <StoreDetailView
            storeId={selectedStoreId}
            onBack={handleBackToStores}
          />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
