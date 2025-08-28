
import { API_URL } from '../constants';
import { Equipment } from '../types';

async function fetchAPI<T,>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export const equipmentService = {
  getSheets: async (): Promise<string[]> => {
    return fetchAPI<string[]>(`${API_URL}?action=getSheets`);
  },

  getAllEquipment: async (sheet: string): Promise<Equipment[]> => {
    const url = `${API_URL}?action=getAll&sheet=${encodeURIComponent(sheet)}`;
    return fetchAPI<Equipment[]>(url);
  },

  saveEquipment: async (equipment: Equipment, sheet: string, isUpdate: boolean): Promise<any> => {
    const payload = {
      action: isUpdate ? 'update' : 'create',
      equipment,
      sheet,
    };
    return fetchAPI(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  deleteEquipment: async (siNo: number, sheet: string): Promise<any> => {
    const payload = {
      action: 'delete',
      siNo, // Changed from slNo to siNo to match new interface
      sheet,
    };
    return fetchAPI(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};
