import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SalesEntry } from './pages/SalesEntry';
import { Associates } from './pages/Associates';
import { MonthlySetup } from './pages/MonthlySetup';
import { History } from './pages/History';

function renderPage(page) {
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'sales-entry': return <SalesEntry />;
    case 'associates': return <Associates />;
    case 'monthly-setup': return <MonthlySetup />;
    case 'history': return <History />;
    default: return <Dashboard />;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage(currentPage)}
    </Layout>
  );
}

export default App;
