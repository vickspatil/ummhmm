
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

    if (key === 'Own' || key === 'Rental') {
        if (text === '✓') {
            return <span className="text-emerald-600 text-center block"><i className="fa-solid fa-check"></i></span>;
        }
        if (text === '-') {
            return <span className="text-slate-400 text-center block"><i className="fa-solid fa-minus"></i></span>;
        }
        return <span title={text}>{text}</span>;
    }

    if (key === 'Running') {
        if (text.toLowerCase() === 'yes') {
             return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Yes
            </span>;
        }
        if (text && text !== '-') {
             return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {text}
            </span>;
        }
        return <span className="text-slate-400">-</span>;
    }
    
    return <span title={String(value)}>{value}</span>;
}


export const EquipmentTable: React.FC<EquipmentTableProps> = ({ data, isLoading, onEdit, onDelete, selectedItems, onSelectItem, onSelectAll }) => {
  const currentPageIds = data.map(item => item['SI No']);
  const isAllSelected = data.length > 0 && currentPageIds.every(id => selectedItems.includes(id));

  return (
    <div className="custom-scrollbar overflow-auto max-h-[65vh]">
      <table className="min-w-[1200px] w-full table-fixed text-sm">
        <colgroup>
          <col className="w-12" />
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
                  <td key={header.key} className="px-3 py-2.5 border-r border-slate-100 align-top whitespace-nowrap overflow-hidden text-ellipsis group-hover:border-blue-100">
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
