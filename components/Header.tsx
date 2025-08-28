
import React from 'react';

interface HeaderProps {
    onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
            <i className="fas fa-tools"></i>
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-800">Equipment Dashboard</h1>
            <p className="text-slate-500 text-sm">Streamlined inventory management for your fleet & sites</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 shadow-md transition-transform transform hover:scale-105"
        >
          <i className="fas fa-rotate"></i>
          Refresh
        </button>
      </div>
    </header>
  );
};
