import React, { useState, useEffect } from 'react';
import { Plus, Edit3, X, Sparkles } from 'lucide-react';

export default function TodoForm({ onSubmit, editingTodo, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
      });
      if (!editingTodo) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="form-card" id="todo-form-card">
      <div className="form-header">
        {editingTodo ? (
          <>
            <Edit3 size={20} color="#818cf8" />
            <span>Edit Task</span>
          </>
        ) : (
          <>
            <Sparkles size={20} color="#818cf8" />
            <span>Create New Task</span>
          </>
        )}
      </div>

      <form className="todo-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className="form-input-group">
          <input
            id="todo-title-input"
            type="text"
            className="form-input"
            placeholder="What needs to be done? (e.g. Deploy Spring Boot backend)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus={!editingTodo}
          />
        </div>

        <div className="form-input-group">
          <textarea
            id="todo-desc-input"
            className="form-input form-textarea"
            placeholder="Add details, notes, or checklist (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="form-actions">
          {editingTodo && (
            <button
              id="cancel-edit-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              <X size={16} />
              Cancel
            </button>
          )}

          <button
            id="submit-todo-btn"
            type="submit"
            className="btn btn-primary"
            disabled={!title.trim() || isSubmitting}
          >
            {editingTodo ? (
              <>
                <Edit3 size={16} />
                {isSubmitting ? 'Saving...' : 'Update Task'}
              </>
            ) : (
              <>
                <Plus size={16} />
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
