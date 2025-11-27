import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentView: 'dashboard' | 'clients' | 'projects' | 'archive';
  onNavigate: (view: 'dashboard' | 'clients' | 'projects' | 'archive') => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'clients', label: '고객사', icon: '🏢' },
    { id: 'projects', label: '프로젝트', icon: '📁' },
    { id: 'archive', label: '아카이브', icon: '📦' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">PublicPulse</h1>
          <p className="text-sm text-gray-500">프로젝트 관리</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
