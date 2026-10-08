import React, { useState, useEffect, useMemo } from 'react';
import { todoApi } from './api/todoApi';
import StatsCard from './components/StatsCard';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import { Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [search, setSearch] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getTodos();
      setTodos(data);
      setBackendOnline(true);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setBackendOnline(false);
      showToast('Could not connect to Spring Boot backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();

    // Check health periodically
    const healthInterval = setInterval(async () => {
      const isUp = await todoApi.checkHealth();
      setBackendOnline(isUp);
    }, 15000);

    return () => clearInterval(healthInterval);
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTodo) {
        const updated = await todoApi.updateTodo(editingTodo.id, formData);
        setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTodo(null);
        showToast('Task updated successfully!');
      } else {
        const created = await todoApi.createTodo(formData);
        setTodos((prev) => [created, ...prev]);
        showToast('Task created successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await todoApi.toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      // Revert on failure
      fetchTodos();
      showToast('Failed to update task status', 'error');
    }
  };

  const handleDelete = async (id) => {
    const prevTodos = [...todos];
    // Optimistic deletion
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await todoApi.deleteTodo(id);
      showToast('Task deleted');
      if (editingTodo && editingTodo.id === id) {
        setEditingTodo(null);
      }
    } catch (err) {
      setTodos(prevTodos);
      showToast('Failed to delete task', 'error');
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter, search]);

  const counts = useMemo(() => ({
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  }), [todos]);

  return (
    <>
      <div className="ambient-bg">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
      </div>

      <div className="app-container">
        <header className="app-header">
          <div className="header-badge" id="backend-status-indicator">
            <span
              className={`status-dot ${
                backendOnline === null ? 'checking' : backendOnline ? '' : 'offline'
              }`}
            />
            <span>
              {backendOnline === null
                ? 'Connecting backend...'
                : backendOnline
                ? 'Spring Boot API Online'
                : 'Backend Disconnected'}
            </span>
          </div>
          <h1 className="app-title">TaskFlow</h1>
          <p className="app-subtitle">
            A production-ready fullstack task manager built with Spring Boot, React, and MySQL on AWS Free Tier.
          </p>
        </header>

        <StatsCard todos={todos} />

        <TodoForm
          onSubmit={handleCreateOrUpdate}
          editingTodo={editingTodo}
          onCancelEdit={() => setEditingTodo(null)}
        />

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          counts={counts}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading tasks...
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onEdit={setEditingTodo}
            onDelete={handleDelete}
            search={search}
            filter={filter}
          />
        )}

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} TaskFlow &bull; Enterprise Cloud Architecture</p>
          <div className="tech-stack-pills">
            <span className="tech-pill">Java 21</span>
            <span className="tech-pill">Spring Boot 3</span>
            <span className="tech-pill">React 18</span>
            <span className="tech-pill">MySQL 8</span>
            <span className="tech-pill">Docker Compose</span>
            <span className="tech-pill">AWS EC2 Free Tier</span>
          </div>
        </footer>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
