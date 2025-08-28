
import React from 'react';

interface ControlsProps {
  sheets: string[];
  currentSheet: string;
  onSheetChange: (sheet: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkUpdateStatus: (field: 'Own' | 'Rental', value: '✓' | '-') => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
    sheets, currentSheet, onSheetChange, searchQuery, onSearchChange, onAdd, onRefresh,
    selectedCount, onClearSelection, onBulkDelete, onBulkUpdateStatus 
}) => {
  if (selectedCount > 0) {
    return (
      <section className="bg-blue-100 border-blue-300 border-2 border-dashed rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-800 text-lg">{selectedCount}</span>
          <span className="text-blue-700">item{selectedCount > 1 ? 's' : ''} selected</span>
          <button onClick={onClearSelection} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Clear selection</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => onBulkUpdateStatus('Own', '✓')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 text-sm shadow-md transition-transform transform hover:scale-105">
            <i className="fa-solid fa-user-check"></i> Mark as Owned
          </button>
          <button onClick={() => onBulkUpdateStatus('Rental', '✓')} className="inline-flex items-center gap-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 text-sm shadow-md transition-transform transform hover:scale-105">
            <i className="fa-solid fa-truck-ramp-box"></i> Mark as Rented
          </button>
          <button onClick={onBulkDelete} className="inline-flex items-center gap-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 text-sm shadow-md transition-transform transform hover:scale-105">
            <i className="fa-solid fa-trash"></i> Delete Selected
          </button>
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <select
          id="sheetSelector"
          value={currentSheet}
          onChange={(e) => onSheetChange(e.target.value)}
          className="w-full sm:w-56 border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          {sheets.map(sheet => (
            <option key={sheet} value={sheet}>{sheet}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            id="searchInput"
            type="text"
            placeholder="Search by equipment, make, year..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 shadow-md transition-transform transform hover:scale-105"
          >
            <i className="fa-solid fa-plus"></i> Add
          </button>
          <button
            onClick={onRefresh}
            className="sm:hidden inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 shadow-md transition-transform transform hover:scale-105"
          >
            <i className="fas fa-rotate"></i> Refresh
          </button>
        </div>
      </div>
    </section>
  );
};
