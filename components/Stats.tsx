
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
    
    // Count equipment with insurance
    const insuredEquipment = data.filter(item => {
      const insurance = item['Insurance'];
      return insurance && insurance.toString().trim() !== '' && insurance.toString().trim() !== '-';
    }).length;
    
    // Count equipment with permits
    const permittedEquipment = data.filter(item => {
      const permit = item['Permit'];
      return permit && permit.toString().trim() !== '' && permit.toString().trim() !== '-';
    }).length;
    
    // Count equipment with fitness certificates
    const fitEquipment = data.filter(item => {
      const fitness = item['Fitness Certificate'];
      return fitness && fitness.toString().trim() !== '' && fitness.toString().trim() !== '-';
    }).length;
    
    return { totalEquipment, insuredEquipment, permittedEquipment, fitEquipment };
  }, [data]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatsCard icon="fa-solid fa-box" iconBgColor="bg-blue-600" value={stats.totalEquipment} label="Total Equipment" />
      <StatsCard icon="fa-solid fa-shield-check" iconBgColor="bg-emerald-500" value={stats.insuredEquipment} label="Insured" />
      <StatsCard icon="fa-solid fa-file-contract" iconBgColor="bg-amber-500" value={stats.permittedEquipment} label="Permitted" />
    </section>
  );
};
