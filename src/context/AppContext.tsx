import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { AppData, Client, Project, Todo, ProjectStatus } from '../types';
import { loadData, saveData, generateId } from '../utils/storage';

interface AppContextType {
  data: AppData;
  // Client operations
  addClient: (name: string, description?: string) => void;
  updateClient: (id: string, name: string, description?: string) => void;
  deleteClient: (id: string) => void;
  // Project operations
  addProject: (clientId: string, name: string, description: string, assignee: string) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
  restoreProject: (id: string) => void;
  deleteArchivedProject: (id: string) => void;
  // Todo operations
  addTodo: (projectId: string, content: string) => void;
  updateTodo: (projectId: string, todoId: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  deleteTodo: (projectId: string, todoId: string) => void;
  toggleTodo: (projectId: string, todoId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Client operations
  const addClient = (name: string, description?: string) => {
    const newClient: Client = {
      id: generateId(),
      name,
      description,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, clients: [...prev.clients, newClient] }));
  };

  const updateClient = (id: string, name: string, description?: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c =>
        c.id === id ? { ...c, name, description } : c
      )
    }));
  };

  const deleteClient = (id: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id),
      projects: prev.projects.filter(p => p.clientId !== id),
      archivedProjects: prev.archivedProjects.filter(p => p.clientId !== id)
    }));
  };

  // Project operations
  const addProject = (clientId: string, name: string, description: string, assignee: string) => {
    const newProject: Project = {
      id: generateId(),
      clientId,
      name,
      description,
      status: 'planning',
      assignee,
      todos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    }));
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const archiveProject = (id: string) => {
    setData(prev => {
      const project = prev.projects.find(p => p.id === id);
      if (!project) return prev;

      const archivedProject = {
        ...project,
        status: 'completed' as ProjectStatus,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        ...prev,
        projects: prev.projects.filter(p => p.id !== id),
        archivedProjects: [...prev.archivedProjects, archivedProject]
      };
    });
  };

  const restoreProject = (id: string) => {
    setData(prev => {
      const project = prev.archivedProjects.find(p => p.id === id);
      if (!project) return prev;

      const restoredProject = {
        ...project,
        status: 'in_progress' as ProjectStatus,
        completedAt: undefined,
        updatedAt: new Date().toISOString()
      };

      return {
        ...prev,
        archivedProjects: prev.archivedProjects.filter(p => p.id !== id),
        projects: [...prev.projects, restoredProject]
      };
    });
  };

  const deleteArchivedProject = (id: string) => {
    setData(prev => ({
      ...prev,
      archivedProjects: prev.archivedProjects.filter(p => p.id !== id)
    }));
  };

  // Todo operations
  const addTodo = (projectId: string, content: string) => {
    const newTodo: Todo = {
      id: generateId(),
      content,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? { ...p, todos: [...p.todos, newTodo], updatedAt: new Date().toISOString() }
          : p
      )
    }));
  };

  const updateTodo = (projectId: string, todoId: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              todos: p.todos.map(t => t.id === todoId ? { ...t, ...updates } : t),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  };

  const deleteTodo = (projectId: string, todoId: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              todos: p.todos.filter(t => t.id !== todoId),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  };

  const toggleTodo = (projectId: string, todoId: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              todos: p.todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      addClient,
      updateClient,
      deleteClient,
      addProject,
      updateProject,
      deleteProject,
      archiveProject,
      restoreProject,
      deleteArchivedProject,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
