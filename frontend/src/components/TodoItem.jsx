import React from 'react';
import { CheckCircle2, Circle, Trash2, Edit2, Calendar } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      id={`todo-item-${todo.id}`}
    >
      <button
        id={`toggle-todo-${todo.id}`}
        type="button"
        className={`check-btn ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed ? (
          <CheckCircle2 size={24} color="#10b981" />
        ) : (
          <Circle size={24} />
        )}
      </button>

      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}
        <div className="todo-meta">
          <span className="todo-meta-item">
            <Calendar size={13} />
            {formatDate(todo.createdAt || todo.updatedAt)}
          </span>
          {todo.completed && (
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
              &bull; Completed
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          id={`edit-todo-${todo.id}`}
          type="button"
          className="action-icon-btn edit"
          onClick={() => onEdit(todo)}
          title="Edit Task"
          aria-label="Edit Task"
        >
          <Edit2 size={16} />
        </button>

        <button
          id={`delete-todo-${todo.id}`}
          type="button"
          className="action-icon-btn delete"
          onClick={() => onDelete(todo.id)}
          title="Delete Task"
          aria-label="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
