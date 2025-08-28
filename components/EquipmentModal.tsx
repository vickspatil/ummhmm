
import React, { useState, useEffect } from 'react';
import { Equipment, FORM_KEY_MAP, API_KEY_TO_FORM_MAP } from '../types';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Equipment) => void;
  editingItem: Equipment | null;
}

const initialFormState = {
    equipment: '', make: '', year: '', siteLocation: '', registrationNumber: '', 
    insurance: '', permit: '', tax: '', fitnessCertificate: '', remarks: ''
};

export const EquipmentModal: React.FC<EquipmentModalProps> = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editingItem) {
        const newFormData: {[key: string]: string | number} = {...initialFormState};
        Object.keys(editingItem).forEach(key => {
            const formKey = API_KEY_TO_FORM_MAP[key as keyof Equipment];
            if(formKey) {
                newFormData[formKey] = editingItem[key as keyof Equipment];
            }
        });
        setFormData(newFormData as typeof initialFormState);
    } else {
        setFormData(initialFormState);
    }
  }, [editingItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipment.trim()) {
        alert('Equipment description is required.');
        return;
    }
    if (!formData.siteLocation.trim()) {
        alert('Site location is required.');
        return;
    }
    
    const apiData: Partial<Equipment> = {};
    Object.keys(formData).forEach(key => {
      const apiKey = FORM_KEY_MAP[key];
      if (apiKey) {
        apiData[apiKey] = formData[key as keyof typeof formData] as any;
      }
    });

    if (editingItem) {
        apiData['SI No'] = editingItem['SI No']; // Changed from 'Sl No' to 'SI No'
    }

    onSave(apiData as Equipment);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold">{editingItem ? 'Edit Equipment' : 'Add Equipment'}</h2>
          <button type="button" className="p-2 rounded-lg hover:bg-slate-100" onClick={onClose}>
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium mb-1">Equipment Description<span className="text-red-500"> *</span></label>
            <input id="equipment" name="equipment" type="text" value={formData.equipment} onChange={handleChange} required className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium mb-1">Make</label>
              <input id="make" name="make" type="text" value={formData.make} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">Year of Manufacture</label>
              <input id="year" name="year" type="number" min="1900" max={new Date().getFullYear() + 1} value={formData.year} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="siteLocation" className="block text-sm font-medium mb-1">Site Location<span className="text-red-500"> *</span></label>
            <input id="siteLocation" name="siteLocation" type="text" value={formData.siteLocation} onChange={handleChange} required className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium mb-1">Registration Number</label>
            <input id="registrationNumber" name="registrationNumber" type="text" value={formData.registrationNumber} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="insurance" className="block text-sm font-medium mb-1">Insurance Date</label>
              <input id="insurance" name="insurance" type="text" placeholder="DD-MM-YY" value={formData.insurance} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="permit" className="block text-sm font-medium mb-1">Permit Date</label>
              <input id="permit" name="permit" type="text" placeholder="DD-MM-YY" value={formData.permit} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tax" className="block text-sm font-medium mb-1">Tax Date</label>
              <input id="tax" name="tax" type="text" placeholder="DD-MM-YY" value={formData.tax} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="fitnessCertificate" className="block text-sm font-medium mb-1">Fitness Certificate</label>
              <input id="fitnessCertificate" name="fitnessCertificate" type="text" placeholder="DD-MM-YYYY" value={formData.fitnessCertificate} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium mb-1">Remarks</label>
            <input id="remarks" name="remarks" type="text" value={formData.remarks} onChange={handleChange} className="w-full border bg-white border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" className="rounded-lg px-4 py-2 border border-slate-300 hover:bg-slate-50" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-transform transform hover:scale-105"><i className="fa-solid fa-floppy-disk mr-2"></i>Save</button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }   
      `}</style>
    </div>
  );
};

