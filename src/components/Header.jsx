import './Header.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  'sales-entry': 'Sales Entry',
  associates: 'Associates',
  'monthly-setup': 'Monthly Setup',
  history: 'History',
};

export function Header({ currentPage, onMenuToggle }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <span className="header-menu-icon">☰</span>
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{PAGE_TITLES[currentPage] ?? currentPage}</h1>
          <span className="header-date">{today}</span>
        </div>
      </div>
      <div className="header-right">
        <div className="header-store-badge">
          <span className="header-store-icon">🏪</span>
          <span className="header-store-name">My Store</span>
        </div>
      </div>
    </header>
  );
}
