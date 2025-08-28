
import { Equipment } from './types';

export const API_URL = 'https://script.google.com/macros/s/AKfycbx1Jja51o7KXf75G6rYDmYTD1VOYFuYyGbA5YQoAiKkxhdJNhW_LDaUx9FZ_Me7VjaKiQ/exec';

export const TABLE_HEADERS: { key: keyof Equipment; label: string; className: string }[] = [
  { key: 'SI No', label: 'SI No', className: 'w-16' },
  { key: 'Equipment Description/Make', label: 'Equipment Description/Make', className: 'w-[220px]' },
  { key: 'Make', label: 'Make', className: 'w-[140px]' },
  { key: 'Year of Manufacture', label: 'Year of Manufacture', className: 'w-24' },
  { key: 'Site Location', label: 'Site Location', className: 'w-[140px]' },
  { key: 'Registration Number', label: 'Registration Number', className: 'w-[160px]' },
  { key: 'Insurance', label: 'Insurance', className: 'w-32' },
  { key: 'Permit', label: 'Permit', className: 'w-24' },
  { key: 'Tax', label: 'Tax', className: 'w-24' },
  { key: 'Fitness Certificate', label: 'Fitness Certificate', className: 'w-[140px]' },
  { key: 'Remarks', label: 'Remarks', className: 'w-[220px]' },
];
