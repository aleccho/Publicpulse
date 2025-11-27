export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed';

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  assignee: string;
  todos: Todo[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface AppData {
  clients: Client[];
  projects: Project[];
  archivedProjects: Project[];
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: '기획',
  in_progress: '진행중',
  review: '검토',
  completed: '완료'
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  planning: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  review: 'bg-yellow-500',
  completed: 'bg-green-500'
};
