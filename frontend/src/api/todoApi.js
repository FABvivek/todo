// API Client for Spring Boot Backend
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const todoApi = {
  async getTodos(completed = null, search = '') {
    const params = new URLSearchParams();
    if (completed !== null && completed !== undefined) {
      params.append('completed', completed);
    }
    if (search && search.trim() !== '') {
      params.append('search', search.trim());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/todos${query}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks (HTTP ${res.status})`);
    }
    return res.json();
  },

  async getTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch task #${id}`);
    }
    return res.json();
  },

  async createTodo(data) {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create task');
    }
    return res.json();
  },

  async updateTodo(id, data) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update task');
    }
    return res.json();
  },

  async toggleTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error('Failed to toggle task status');
    }
    return res.json();
  },

  async deleteTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete task');
    }
    return res.json();
  },

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }
};
