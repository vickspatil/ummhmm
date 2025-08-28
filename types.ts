
export interface Equipment {
  'SI No': number; // Changed from 'Sl No' to 'SI No' to match actual spreadsheet
  'Equipment Description/Make': string; // Updated to match actual column
  'Make': string;
  'Year of Manufacture': number | string; // Updated to match actual column
  'Site Location': string; // Updated to match actual column
  'Registration Number': string; // Updated to match actual column
  'Insurance': string; // Updated to match actual column
  'Permit': string; // Updated to match actual column
  'Tax': string; // Updated to match actual column
  'Fitness Certificate': string; // Updated to match actual column
  'Remarks': string; // Updated to match actual column
  [key: string]: string | number; // For dynamic access
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

// Maps form field IDs to the keys expected by the API
export const FORM_KEY_MAP: { [key: string]: keyof Equipment } = {
  equipment: 'Equipment Description/Make',
  make: 'Make',
  year: 'Year of Manufacture',
  siteLocation: 'Site Location',
  registrationNumber: 'Registration Number',
  insurance: 'Insurance',
  permit: 'Permit',
  tax: 'Tax',
  fitnessCertificate: 'Fitness Certificate',
  remarks: 'Remarks',
};

// Maps API keys back to form field IDs for populating the form
export const API_KEY_TO_FORM_MAP: { [key in keyof Equipment]?: string } = Object.entries(FORM_KEY_MAP).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {} as { [key in keyof Equipment]?: string });
