import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider } from '../hooks/useAppContext'
import { ProgressBar } from '../components/ProgressBar'
import App from '../App'

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

beforeEach(() => {
  localStorageMock.clear()
})

describe('ProgressBar', () => {
  it('renders with correct percentage', () => {
    render(
      <AppProvider>
        <ProgressBar percentage={60} />
      </AppProvider>
    )
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '60')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('shows percentage label by default', () => {
    render(
      <AppProvider>
        <ProgressBar percentage={75} />
      </AppProvider>
    )
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(
      <AppProvider>
        <ProgressBar percentage={75} showLabel={false} />
      </AppProvider>
    )
    expect(screen.queryByText('75%')).not.toBeInTheDocument()
  })

  it('clamps percentage to 100 for visual display', () => {
    render(
      <AppProvider>
        <ProgressBar percentage={150} />
      </AppProvider>
    )
    const bar = screen.getByRole('progressbar')
    expect(bar.style.width).toBe('100%')
  })
})

describe('App navigation', () => {
  it('renders the header with app title', () => {
    render(<App />)
    expect(screen.getByText('Retail Sales Tracker')).toBeInTheDocument()
  })

  it('renders Dashboard view by default', () => {
    render(<App />)
    // The h1 heading "Dashboard" is shown in the main content
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Stores view when clicking Stores nav', () => {
    render(<App />)
    const storesNavBtn = screen.getByRole('button', { name: /Stores/i })
    fireEvent.click(storesNavBtn)
    expect(screen.getByText('+ Add Store')).toBeInTheDocument()
  })

  it('shows empty state on Dashboard when no stores', () => {
    render(<App />)
    expect(
      screen.getByText('Welcome to Sales Goal Tracker')
    ).toBeInTheDocument()
  })
})

describe('Store management', () => {
  it('can add a store', () => {
    render(<App />)
    // Navigate to Stores
    fireEvent.click(screen.getByRole('button', { name: /Stores/i }))

    // Click Add Store
    fireEvent.click(screen.getByText('+ Add Store'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Fill in the form
    const nameInput = screen.getByPlaceholderText('e.g. Downtown Branch')
    const locationInput = screen.getByPlaceholderText('e.g. 123 Main St, City')
    fireEvent.change(nameInput, { target: { value: 'Test Store' } })
    fireEvent.change(locationInput, { target: { value: '123 Test Ave' } })

    // Submit via the form's submit button (not the heading)
    fireEvent.click(screen.getByRole('button', { name: 'Add Store' }))

    // Store should appear
    expect(screen.getByText('Test Store')).toBeInTheDocument()
    expect(screen.getByText('123 Test Ave')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Stores/i }))
    fireEvent.click(screen.getByText('+ Add Store'))
    fireEvent.click(screen.getByRole('button', { name: 'Add Store' }))
    expect(screen.getByText('Store name is required')).toBeInTheDocument()
    expect(screen.getByText('Location is required')).toBeInTheDocument()
  })

  it('can cancel adding a store', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Stores/i }))
    fireEvent.click(screen.getByText('+ Add Store'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Dashboard summary', () => {
  it('shows store and associate counts after adding data', () => {
    render(<App />)

    // Add a store
    fireEvent.click(screen.getByRole('button', { name: /Stores/i }))
    fireEvent.click(screen.getByText('+ Add Store'))
    fireEvent.change(screen.getByPlaceholderText('e.g. Downtown Branch'), {
      target: { value: 'My Store' },
    })
    fireEvent.change(screen.getByPlaceholderText('e.g. 123 Main St, City'), {
      target: { value: '1 Main St' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Store' }))

    // Go to dashboard
    fireEvent.click(screen.getByRole('button', { name: /Dashboard/i }))
    expect(screen.getByText('Total Stores')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})

describe('Console errors', () => {
  it('does not produce React errors during normal render', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
