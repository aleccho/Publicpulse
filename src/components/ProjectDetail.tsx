import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Project, ProjectStatus } from '../types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { data, updateProject, addTodo, deleteTodo, toggleTodo, updateTodo } = useApp();
  const [newTodoContent, setNewTodoContent] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const client = data.clients.find(c => c.id === project.clientId);
  const completedTodos = project.todos.filter(t => t.completed).length;
  const totalTodos = project.todos.length;
  const progress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    addTodo(project.id, newTodoContent);
    setNewTodoContent('');
  };

  const handleStatusChange = (status: ProjectStatus) => {
    updateProject(project.id, { status });
  };

  const startEditTodo = (todoId: string, content: string) => {
    setEditingTodoId(todoId);
    setEditingContent(content);
  };

  const saveEditTodo = () => {
    if (editingTodoId && editingContent.trim()) {
      updateTodo(project.id, editingTodoId, { content: editingContent });
    }
    setEditingTodoId(null);
    setEditingContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← 뒤로
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
            <span className={`px-2 py-1 text-xs text-white rounded ${PROJECT_STATUS_COLORS[project.status]}`}>
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
          </div>
          <p className="text-blue-600">{client?.name}</p>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">프로젝트 정보</h3>
            <div className="space-y-2">
              <p><span className="text-gray-500">담당자:</span> {project.assignee || '-'}</p>
              <p><span className="text-gray-500">생성일:</span> {new Date(project.createdAt).toLocaleDateString('ko-KR')}</p>
              <p><span className="text-gray-500">최근 업데이트:</span> {new Date(project.updatedAt).toLocaleDateString('ko-KR')}</p>
            </div>
            {project.description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">설명</h4>
                <p className="text-gray-700">{project.description}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">상태 변경</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PROJECT_STATUS_LABELS).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as ProjectStatus)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    project.status === status
                      ? `${PROJECT_STATUS_COLORS[status as ProjectStatus]} text-white`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">진행률</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">{progress}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{completedTodos} / {totalTodos} 완료</p>
            </div>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">할 일 목록</h3>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTodoContent}
            onChange={e => setNewTodoContent(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="새로운 할 일을 입력하세요"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            추가
          </button>
        </form>

        {/* Todo Items */}
        <div className="space-y-2">
          {project.todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">할 일이 없습니다.</p>
          ) : (
            project.todos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(project.id, todo.id)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {editingTodoId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEditTodo();
                        if (e.key === 'Escape') setEditingTodoId(null);
                      }}
                    />
                    <button
                      onClick={saveEditTodo}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingTodoId(null)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 ${
                        todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                      }`}
                    >
                      {todo.content}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(todo.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <button
                      onClick={() => startEditTodo(todo.id, todo.content)}
                      className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteTodo(project.id, todo.id)}
                      className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
