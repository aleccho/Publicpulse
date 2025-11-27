import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Project, ProjectStatus } from '../types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../types';
import { ProjectDetail } from './ProjectDetail';

export function ProjectList() {
  const { data, addProject, updateProject, deleteProject, archiveProject } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterClient, setFilterClient] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    description: '',
    assignee: '',
    status: 'planning' as ProjectStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.clientId) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        clientId: formData.clientId,
        name: formData.name,
        description: formData.description,
        assignee: formData.assignee,
        status: formData.status
      });
      setEditingProject(null);
    } else {
      addProject(formData.clientId, formData.name, formData.description, formData.assignee);
    }
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      clientId: project.clientId,
      name: project.name,
      description: project.description,
      assignee: project.assignee,
      status: project.status
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
      deleteProject(id);
    }
  };

  const handleArchive = (id: string) => {
    if (confirm('이 프로젝트를 완료 처리하고 아카이브로 이동하시겠습니까?')) {
      archiveProject(id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      clientId: data.clients[0]?.id || '',
      name: '',
      description: '',
      assignee: '',
      status: 'planning'
    });
  };

  const filteredProjects = data.projects.filter(project => {
    if (filterClient !== 'all' && project.clientId !== filterClient) return false;
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    return true;
  });

  if (selectedProject) {
    const currentProject = data.projects.find(p => p.id === selectedProject.id);
    if (currentProject) {
      return (
        <ProjectDetail
          project={currentProject}
          onBack={() => setSelectedProject(null)}
        />
      );
    }
    setSelectedProject(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">프로젝트 관리</h2>
          <p className="text-gray-500">진행중인 프로젝트를 관리하세요</p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...formData, clientId: data.clients[0]?.id || '' });
            setShowForm(true);
          }}
          disabled={data.clients.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          + 프로젝트 추가
        </button>
      </div>

      {data.clients.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800">프로젝트를 추가하려면 먼저 고객사를 등록해주세요.</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
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
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="all">모든 상태</option>
          {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingProject ? '프로젝트 수정' : '새 프로젝트 추가'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  고객사 *
                </label>
                <select
                  value={formData.clientId}
                  onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">선택하세요</option>
                  {data.clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  담당자
                </label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="담당자 이름"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로젝트명 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="프로젝트명을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="프로젝트에 대한 설명"
                rows={3}
              />
            </div>
            {editingProject && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProject ? '수정' : '추가'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project List */}
      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">프로젝트가 없습니다.</p>
          </div>
        ) : (
          filteredProjects.map(project => {
            const client = data.clients.find(c => c.id === project.clientId);
            const completedTodos = project.todos.filter(t => t.completed).length;
            const totalTodos = project.todos.length;

            return (
              <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                        {project.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs text-white rounded ${PROJECT_STATUS_COLORS[project.status]}`}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">{client?.name}</p>
                    {project.description && (
                      <p className="text-gray-500 mt-2">{project.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>담당자: {project.assignee || '-'}</span>
                      <span>할 일: {completedTodos}/{totalTodos}</span>
                      <span>업데이트: {new Date(project.updatedAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleArchive(project.id)}
                      className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      완료
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
