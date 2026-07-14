import './NavLink.css';

export function NavLink({ icon, label, isActive, onClick }) {
  return (
    <button
      className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="nav-link-icon">{icon}</span>
      <span className="nav-link-label">{label}</span>
      {isActive && <span className="nav-link-indicator" />}
    </button>
  );
}
