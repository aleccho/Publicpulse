import { useApp } from '../context/AppContext';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../types';

export function Dashboard() {
  const { data } = useApp();

  const activeProjects = data.projects;
  const totalTodos = activeProjects.reduce((sum, p) => sum + p.todos.length, 0);
  const completedTodos = activeProjects.reduce(
    (sum, p) => sum + p.todos.filter(t => t.completed).length,
    0
  );

  const statusCounts = activeProjects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentProjects = [...activeProjects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">대시보드</h2>
        <p className="text-gray-500">프로젝트 현황 요약</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">고객사</p>
          <p className="text-3xl font-bold text-gray-800">{data.clients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">진행중 프로젝트</p>
          <p className="text-3xl font-bold text-blue-600">{activeProjects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">완료된 프로젝트</p>
          <p className="text-3xl font-bold text-green-600">{data.archivedProjects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">할 일 진행률</p>
          <p className="text-3xl font-bold text-purple-600">
            {totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-400">{completedTodos} / {totalTodos}</p>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">상태별 프로젝트</h3>
        <div className="flex gap-4 flex-wrap">
          {Object.entries(PROJECT_STATUS_LABELS).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${PROJECT_STATUS_COLORS[status as keyof typeof PROJECT_STATUS_COLORS]}`}></span>
              <span className="text-gray-600">{label}:</span>
              <span className="font-semibold">{statusCounts[status] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 업데이트된 프로젝트</h3>
        {recentProjects.length === 0 ? (
          <p className="text-gray-500">프로젝트가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {recentProjects.map(project => {
              const client = data.clients.find(c => c.id === project.clientId);
              return (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{project.name}</p>
                    <p className="text-sm text-gray-500">{client?.name || '알 수 없음'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{project.assignee}</span>
                    <span className={`px-2 py-1 text-xs text-white rounded ${PROJECT_STATUS_COLORS[project.status]}`}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
