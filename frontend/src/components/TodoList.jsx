import React from 'react';
import TodoItem from './TodoItem';
import { ClipboardList, Sparkles } from 'lucide-react';

export default function TodoList({ todos, onToggle, onEdit, onDelete, search, filter }) {
  if (todos.length === 0) {
    let emptyTitle = "You're all caught up!";
    let emptyDesc = "No tasks yet. Create your first task using the form above.";

    if (search) {
      emptyTitle = 'No matching tasks';
      emptyDesc = `We couldn't find any tasks matching "${search}". Try another search term.`;
    } else if (filter === 'completed') {
      emptyTitle = 'No completed tasks yet';
      emptyDesc = 'Mark tasks as done to see them listed here.';
    } else if (filter === 'active') {
      emptyTitle = 'No active tasks';
      emptyDesc = 'All your tasks have been completed. Great job!';
    }

    return (
      <div className="empty-state" id="empty-state">
        <div className="empty-icon">
          {search ? <ClipboardList size={28} /> : <Sparkles size={28} />}
        </div>
        <h3 className="empty-title">{emptyTitle}</h3>
        <p className="empty-desc">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="todo-list" id="todo-list-container">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
