import React from 'react';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function StatsCard({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-total">
          <ListTodo size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-active">
          <Clock size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{active}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-done">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completed}</span>
        </div>
      </div>
    </div>
  );
}
