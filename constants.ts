
import { Equipment } from './types';

export const API_URL = 'https://script.google.com/macros/s/AKfycbx1Jja51o7KXf75G6rYDmYTD1VOYFuYyGbA5YQoAiKkxhdJNhW_LDaUx9FZ_Me7VjaKiQ/exec';

export const TABLE_HEADERS: { key: keyof Equipment; label: string; className: string }[] = [
  { key: 'SI No', label: 'SI No', className: 'w-20' },
  { key: 'Equipment Description/Make', label: 'Equipment Description/Make', className: 'w-[300px]' },
  { key: 'Make', label: 'Make', className: 'w-[180px]' },
  { key: 'Year of Manufacture', label: 'Year of Manufacture', className: 'w-32' },
  { key: 'Site Location', label: 'Site Location', className: 'w-[180px]' },
  { key: 'Registration Number', label: 'Registration Number', className: 'w-[200px]' },
  { key: 'Insurance', label: 'Insurance', className: 'w-40' },
  { key: 'Permit', label: 'Permit', className: 'w-32' },
  { key: 'Tax', label: 'Tax', className: 'w-32' },
  { key: 'Fitness Certificate', label: 'Fitness Certificate', className: 'w-[180px]' },
  { key: 'Remarks', label: 'Remarks', className: 'w-[250px]' },
];
