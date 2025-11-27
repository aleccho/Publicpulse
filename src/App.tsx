import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ClientList } from './components/ClientList';
import { ProjectList } from './components/ProjectList';
import { Archive } from './components/Archive';

type View = 'dashboard' | 'clients' | 'projects' | 'archive';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientList />;
      case 'projects':
        return <ProjectList />;
      case 'archive':
        return <Archive />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout currentView={currentView} onNavigate={setCurrentView}>
        {renderView()}
      </Layout>
    </AppProvider>
  );
}

export default App;
