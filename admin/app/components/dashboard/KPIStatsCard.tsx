// components/KPIStatsCard.tsx
import React from 'react';

type KPIStatsCardProps = {
  label: string;
  value: string;
  subtext: string;
  icon?: React.ReactNode;
};

const KPIStatsCard = ({ label, value, subtext, icon }: KPIStatsCardProps) => (
  <div className="bg-transparent border border-[#262626] text-[#FAFAFA] p-5 rounded-xl shadow-md flex flex-col  w-full">
    <div className="text-sm  flex items-center justify-between">
      <span>{label}</span>
      {icon}
    </div>
    <div className="text-[20px] mt-7 font-bold">{value}</div>
    <div className="text-xs text-[#A1A1A1]">{subtext}</div>
  </div>
);

export default KPIStatsCard;
