
import React from 'react';
import { Equipment } from '../types';
import { TABLE_HEADERS } from '../constants';

interface EquipmentTableProps {
  data: Equipment[];
  isLoading: boolean;
  onEdit: (item: Equipment) => void;
  onDelete: (siNo: number) => void;
  selectedItems: number[];
  onSelectItem: (siNo: number, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

const renderCell = (item: Equipment, key: keyof Equipment) => {
    const value = item[key] ?? '';
    const text = String(value).trim();

    // Handle empty values
    if (!text || text === '') {
        return <span className="text-slate-400">-</span>;
    }

    // Handle date fields with better formatting
    if (key === 'Insurance' || key === 'Permit' || key === 'Tax' || key === 'Fitness Certificate') {
        if (text && text !== '') {
            return <span className="text-blue-700 font-medium" title={text}>{text}</span>;
        }
        return <span className="text-slate-400">-</span>;
    }

    // Handle SI No with better styling
    if (key === 'SI No') {
        return <span className="font-semibold text-gray-700">{text}</span>;
    }

    // Handle Equipment Description/Make with better styling
    if (key === 'Equipment Description/Make') {
        return <span className="font-medium text-gray-800" title={text}>{text}</span>;
    }

    // Handle Make with better styling
    if (key === 'Make') {
        return <span className="text-blue-600 font-medium">{text}</span>;
    }

    // Handle Year of Manufacture
    if (key === 'Year of Manufacture') {
        return <span className="text-gray-700">{text}</span>;
    }

    // Handle Site Location
    if (key === 'Site Location') {
        return <span className="text-green-700 font-medium">{text}</span>;
    }

    // Handle Registration Number
    if (key === 'Registration Number') {
        return <span className="text-purple-700 font-mono text-sm">{text}</span>;
    }

    // Handle Remarks
    if (key === 'Remarks') {
        return <span className="text-gray-600 italic" title={text}>{text}</span>;
    }
    
    // Default case
    return <span title={String(value)} className="text-gray-700">{value}</span>;
}


export const EquipmentTable: React.FC<EquipmentTableProps> = ({ data, isLoading, onEdit, onDelete, selectedItems, onSelectItem, onSelectAll }) => {
  const currentPageIds = data.map(item => item['SI No']);
  const isAllSelected = data.length > 0 && currentPageIds.every(id => selectedItems.includes(id));

  return (
    <div className="custom-scrollbar overflow-auto max-h-[65vh]">
      <table className="min-w-[1400px] w-full table-fixed text-sm">
        <colgroup>
          <col className="w-16" />
          {TABLE_HEADERS.map(h => <col key={h.key} className={h.className} />)}
          <col className="w-[140px]" />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-blue-800 text-white">
          <tr>
            <th className="px-3 py-3 text-left font-semibold border-r border-blue-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                aria-label="Select all items"
                title="Select all"
              />
            </th>
            {TABLE_HEADERS.map(header => (
              <th key={header.key} className="px-3 py-3 text-left font-semibold border-r border-blue-700 last:border-r-0">
                {header.label}
              </th>
            ))}
            <th className="px-3 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {isLoading ? (
            <tr>
              <td colSpan={TABLE_HEADERS.length + 2} className="py-16 text-center text-blue-700">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-2xl"></i>
                <span className="text-lg">Loading equipment data...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={TABLE_HEADERS.length + 2} className="py-16 text-center text-slate-500">
                <i className="fa-solid fa-box-open text-3xl mb-2"></i>
                <p className="text-lg">No equipment found.</p>
                <p>Try adjusting your search or selecting another category.</p>
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const isSelected = selectedItems.includes(item['SI No']);
              return (
              <tr key={item['SI No']} className={`transition-colors duration-150 group ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-blue-50'}`}>
                <td className="px-3 py-2.5 border-r border-slate-100 align-middle group-hover:border-blue-100">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={isSelected}
                    onChange={(e) => onSelectItem(item['SI No'], e.target.checked)}
                    aria-label={`Select item ${item['SI No']}`}
                  />
                </td>
                {TABLE_HEADERS.map(header => (
                  <td key={header.key} className="px-3 py-2.5 border-r border-slate-100 align-top break-words group-hover:border-blue-100">
                      {renderCell(item, header.key)}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center align-middle">
                  <div className="inline-flex gap-2">
                    <button 
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-transform transform hover:scale-110" 
                      title="Edit">
                        <i className="fa-solid fa-pen"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(item['SI No'])}
                      className="px-3 py-1 rounded-md bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-transform transform hover:scale-110" 
                      title="Delete">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
