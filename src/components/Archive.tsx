import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Archive() {
  const { data, restoreProject, deleteArchivedProject } = useApp();
  const [filterClient, setFilterClient] = useState<string>('all');

  const handleRestore = (id: string) => {
    if (confirm('이 프로젝트를 다시 진행중으로 복원하시겠습니까?')) {
      restoreProject(id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('이 프로젝트를 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      deleteArchivedProject(id);
    }
  };

  const filteredProjects = data.archivedProjects.filter(project => {
    if (filterClient !== 'all' && project.clientId !== filterClient) return false;
    return true;
  });

  // Sort by completion date (most recent first)
  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.completedAt || b.updatedAt).getTime() - new Date(a.completedAt || a.updatedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">완료된 프로젝트</h2>
        <p className="text-gray-500">아카이브된 프로젝트를 확인하세요</p>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={filterClient}
          onChange={e => setFilterClient(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="all">모든 고객사</option>
          {data.clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      {/* Archived Project List */}
      <div className="grid gap-4">
        {sortedProjects.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">완료된 프로젝트가 없습니다.</p>
          </div>
        ) : (
          sortedProjects.map(project => {
            const client = data.clients.find(c => c.id === project.clientId);
            const completedTodos = project.todos.filter(t => t.completed).length;
            const totalTodos = project.todos.length;

            return (
              <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                      <span className="px-2 py-1 text-xs text-white rounded bg-green-500">
                        완료
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">{client?.name || '삭제된 고객사'}</p>
                    {project.description && (
                      <p className="text-gray-500 mt-2">{project.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>담당자: {project.assignee || '-'}</span>
                      <span>할 일: {completedTodos}/{totalTodos} 완료</span>
                      <span>완료일: {project.completedAt ? new Date(project.completedAt).toLocaleDateString('ko-KR') : '-'}</span>
                    </div>

                    {/* Todo Summary */}
                    {project.todos.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 mb-2">완료된 할 일</p>
                        <ul className="space-y-1">
                          {project.todos.slice(0, 5).map(todo => (
                            <li key={todo.id} className="text-sm text-gray-500 flex items-center gap-2">
                              <span className={todo.completed ? 'text-green-500' : 'text-gray-400'}>
                                {todo.completed ? '✓' : '○'}
                              </span>
                              <span className={todo.completed ? 'line-through' : ''}>
                                {todo.content}
                              </span>
                            </li>
                          ))}
                          {project.todos.length > 5 && (
                            <li className="text-sm text-gray-400">
                              ... 외 {project.todos.length - 5}개
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleRestore(project.id)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      복원
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
