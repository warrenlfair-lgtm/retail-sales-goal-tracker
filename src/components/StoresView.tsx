import { useState } from 'react'
import { useAppContext } from '../hooks/useAppContext'
import { Modal } from './Modal'
import type { Store } from '../types'

interface StoreFormData {
  name: string
  location: string
}

interface StoreFormProps {
  store?: Store
  onClose: () => void
}

function StoreForm({ store, onClose }: StoreFormProps) {
  const { dispatch } = useAppContext()
  const [form, setForm] = useState<StoreFormData>({
    name: store?.name ?? '',
    location: store?.location ?? '',
  })
  const [errors, setErrors] = useState<Partial<StoreFormData>>({})

  function validate(): boolean {
    const errs: Partial<StoreFormData> = {}
    if (!form.name.trim()) errs.name = 'Store name is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (store) {
      dispatch({ type: 'UPDATE_STORE', payload: { ...store, ...form } })
    } else {
      dispatch({ type: 'ADD_STORE', payload: form })
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Store Name
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Downtown Branch"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.location}
          onChange={(e) =>
            setForm((f) => ({ ...f, location: e.target.value }))
          }
          placeholder="e.g. 123 Main St, City"
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {store ? 'Save Changes' : 'Add Store'}
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

interface StoresViewProps {
  onSelectStore: (storeId: string) => void
}

export function StoresView({ onSelectStore }: StoresViewProps) {
  const { state, dispatch, getStoreStats } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [editStore, setEditStore] = useState<Store | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const stats = state.stores.map((s) => getStoreStats(s.id)).filter(Boolean)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {state.stores.length} store{state.stores.length !== 1 ? 's' : ''}{' '}
            total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Store
        </button>
      </div>

      {state.stores.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🏪</div>
          <p className="text-lg font-medium">No stores yet</p>
          <p className="text-sm mt-1">Add your first store to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => {
            if (!s) return null
            return (
              <div
                key={s.store.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.store.name}</h3>
                    <p className="text-xs text-gray-500">{s.store.location}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditStore(s.store)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={`Edit ${s.store.name}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(s.store.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${s.store.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>{s.associateCount} associate{s.associateCount !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => onSelectStore(s.store.id)}
                  className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-1"
                >
                  View Details →
                </button>
              </div>
            )
          })}
        </div>
      )}

      {(showForm || editStore) && (
        <Modal
          title={editStore ? 'Edit Store' : 'Add Store'}
          onClose={() => {
            setShowForm(false)
            setEditStore(null)
          }}
        >
          <StoreForm
            store={editStore ?? undefined}
            onClose={() => {
              setShowForm(false)
              setEditStore(null)
            }}
          />
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Delete Store" onClose={() => setDeleteConfirm(null)}>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this store? All associated data
            (associates, goals, sales entries) will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                dispatch({ type: 'DELETE_STORE', payload: deleteConfirm })
                setDeleteConfirm(null)
              }}
              className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
