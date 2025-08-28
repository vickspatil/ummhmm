
import React, { useMemo } from 'react';
import { Equipment } from '../types';

interface StatsCardProps {
  icon: string;
  iconBgColor: string;
  value: number | string;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, iconBgColor, value, label }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
    <div className="flex items-center gap-4">
      <span className={`h-12 w-12 rounded-xl text-white inline-flex items-center justify-center text-xl shadow-lg ${iconBgColor}`}>
        <i className={icon}></i>
      </span>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-slate-500 text-sm">{label}</div>
      </div>
    </div>
  </div>
);


interface StatsProps {
    data: Equipment[];
}

export const Stats: React.FC<StatsProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalEquipment = data.length;
    const ownedEquipment = data.filter(item => String(item['Own']).trim() === '✓').length;
    const rentedEquipment = data.filter(item => String(item['Rental']).trim() === '✓').length;
    return { totalEquipment, ownedEquipment, rentedEquipment };
  }, [data]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatsCard icon="fa-solid fa-box" iconBgColor="bg-blue-600" value={stats.totalEquipment} label="Total Equipment" />
      <StatsCard icon="fa-solid fa-user-check" iconBgColor="bg-emerald-500" value={stats.ownedEquipment} label="Owned" />
      <StatsCard icon="fa-solid fa-truck-ramp-box" iconBgColor="bg-pink-500" value={stats.rentedEquipment} label="Rented" />
    </section>
  );
};
