'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#60a5fa',
  '#facc15',
  '#34d399',
  '#fb923c',
  '#a78bfa',
  '#f87171',
];

type DistributionData = {
  _id: string;
  league?: string;
  count: number;
  match: string;
}[];

interface MatchDistributionChartProps {
  data: DistributionData;
}

const MatchDistributionChart: React.FC<MatchDistributionChartProps> = ({
  data,
}) => {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-transparent border-[#262626] border p-4 rounded-xl shadow-md text-white w-full">
      <h2 className="text-[14px] text-[#fafafa] mb-1">Match Distribution</h2>
      <p className="text-[14px] text-[#A1A1A1] mb-4">
        Breakdown by league/competition
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="match"
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Listing below the chart */}
      <div className="mt-6 space-y-2">
        {data.map((item, index) => (
          <div
            key={item._id + item.match}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-[#E4E4E7]">
                { item.match}
              </span>
            </div>
            <span className="text-[#A1A1AA]">
              {totalCount > 0
                ? `${((item.count / totalCount) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchDistributionChart;
