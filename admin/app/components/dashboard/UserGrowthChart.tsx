// components/UserGrowthChart.tsx
'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Jan', users: 7000 },
  { month: 'Feb', users: 9000 },
  { month: 'Mar', users: 12000 },
  { month: 'Apr', users: 16000 },
  { month: 'May', users: 18000 },
  { month: 'Jun', users: 24000 },
  { month: 'Jul', users: 10000 },
];

const UserGrowthChart = () => (
  <div className="bg-transparent border-[#262626] border p-6 rounded-xl shadow-md text-white w-full">
    <h2 className="text-[14px] text-[#fafafa] mb-1">User Growth</h2>
    <p className="text-[14px]x] text-[#A1A1A1] ">
      Monthly active users over the past 6 months
    </p>
    <div className="w-full mt-10.5">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip />
          <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default UserGrowthChart;
