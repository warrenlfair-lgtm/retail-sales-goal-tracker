import './Dashboard.css';

function StatCard({ icon, label, value, trend, trendLabel, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        <span className={`stat-card-trend ${trend >= 0 ? 'stat-card-trend--up' : 'stat-card-trend--down'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-trend-label">{trendLabel}</div>
    </div>
  );
}

function GoalProgressBar({ label, current, goal, color }) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  return (
    <div className="goal-bar">
      <div className="goal-bar-header">
        <span className="goal-bar-label">{label}</span>
        <span className="goal-bar-pct">{pct}%</span>
      </div>
      <div className="goal-bar-track">
        <div
          className={`goal-bar-fill goal-bar-fill--${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="goal-bar-values">
        <span>${current.toLocaleString()}</span>
        <span>Goal: ${goal.toLocaleString()}</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <h2 className="section-title">Today's Overview</h2>
        <div className="stat-grid">
          <StatCard
            icon="💵"
            label="Today's Sales"
            value="—"
            trend={0}
            trendLabel="No data yet"
            color="blue"
          />
          <StatCard
            icon="🛒"
            label="Transactions"
            value="—"
            trend={0}
            trendLabel="No data yet"
            color="green"
          />
          <StatCard
            icon="👥"
            label="Active Associates"
            value="—"
            trend={0}
            trendLabel="No data yet"
            color="purple"
          />
          <StatCard
            icon="📈"
            label="Avg. Sale"
            value="—"
            trend={0}
            trendLabel="No data yet"
            color="orange"
          />
        </div>
      </div>

      <div className="dashboard-two-col">
        <div className="dashboard-section">
          <h2 className="section-title">Monthly Goal Progress</h2>
          <div className="goal-bars">
            <GoalProgressBar label="Total Sales" current={0} goal={50000} color="blue" />
            <GoalProgressBar label="Transactions" current={0} goal={500} color="green" />
            <GoalProgressBar label="Avg. Basket Size" current={0} goal={100} color="purple" />
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Top Associates</h2>
          <div className="placeholder-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="placeholder-list-item">
                <div className="placeholder-avatar">{i}</div>
                <div className="placeholder-info">
                  <div className="placeholder-name">Associate {i}</div>
                  <div className="placeholder-sub">No sales data yet</div>
                </div>
                <div className="placeholder-value">—</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="empty-state">
          <span className="empty-state-icon">📋</span>
          <p className="empty-state-text">No sales entries yet.</p>
          <p className="empty-state-sub">
            Use <strong>Sales Entry</strong> to record your first sale.
          </p>
        </div>
      </div>
    </div>
  );
}
