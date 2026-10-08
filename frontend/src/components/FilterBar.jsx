import React from 'react';
import { Search, X } from 'lucide-react';

export default function FilterBar({ filter, onFilterChange, search, onSearchChange, counts }) {
  return (
    <div className="control-bar" id="filter-bar">
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          id="search-todos-input"
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-tabs">
        <button
          id="filter-all-btn"
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All ({counts.total})
        </button>
        <button
          id="filter-active-btn"
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => onFilterChange('active')}
        >
          Active ({counts.active})
        </button>
        <button
          id="filter-completed-btn"
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Completed ({counts.completed})
        </button>
      </div>
    </div>
  );
}
