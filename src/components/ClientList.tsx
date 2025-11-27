import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function ClientList() {
  const { data, addClient, updateClient, deleteClient } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateClient(editingId, formData.name, formData.description);
      setEditingId(null);
    } else {
      addClient(formData.name, formData.description);
    }
    setFormData({ name: '', description: '' });
    setShowForm(false);
  };

  const handleEdit = (client: { id: string; name: string; description?: string }) => {
    setEditingId(client.id);
    setFormData({ name: client.name, description: client.description || '' });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 고객사를 삭제하시겠습니까? 관련된 모든 프로젝트도 함께 삭제됩니다.')) {
      deleteClient(id);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">고객사 관리</h2>
          <p className="text-gray-500">고객사를 추가하고 관리하세요</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 고객사 추가
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? '고객사 수정' : '새 고객사 추가'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                고객사명 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="고객사명을 입력하세요"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="고객사에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? '수정' : '추가'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Client List */}
      <div className="grid gap-4">
        {data.clients.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">등록된 고객사가 없습니다.</p>
            <p className="text-sm text-gray-400">위의 버튼을 클릭하여 고객사를 추가하세요.</p>
          </div>
        ) : (
          data.clients.map(client => {
            const projectCount = data.projects.filter(p => p.clientId === client.id).length;
            const archivedCount = data.archivedProjects.filter(p => p.clientId === client.id).length;

            return (
              <div key={client.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                    {client.description && (
                      <p className="text-gray-500 mt-1">{client.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>진행중 프로젝트: {projectCount}개</span>
                      <span>완료 프로젝트: {archivedCount}개</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
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
