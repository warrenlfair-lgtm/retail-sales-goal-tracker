import { NavLink } from './NavLink';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'sales-entry', label: 'Sales Entry', icon: '💰' },
  { id: 'associates', label: 'Associates', icon: '👥' },
  { id: 'monthly-setup', label: 'Monthly Setup', icon: '📅' },
  { id: 'history', label: 'History', icon: '📋' },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">🏪</span>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Sales Tracker</span>
            <span className="sidebar-brand-sub">Retail Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <NavLink
                  icon={item.icon}
                  label={item.label}
                  isActive={currentPage === item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-footer-text">Retail Sales Goal Tracker</span>
          <span className="sidebar-footer-version">v1.0.0</span>
        </div>
      </aside>
    </>
  );
}
