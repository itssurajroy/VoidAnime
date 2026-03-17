'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2, Users, Heart } from 'lucide-react';

interface StatsSidebarProps {
  stats: {
    scoreDistribution: Array<{ score: number; amount: number }>;
    statusDistribution: Array<{ status: string; amount: number }>;
  };
  favorites?: number;
}

export function StatsSidebar({ stats, favorites }: StatsSidebarProps) {
  const data = stats.scoreDistribution?.map(d => ({
    name: d.score,
    value: d.amount
  })) || [];

  const totalMembers = stats.statusDistribution?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="p-8 rounded-[40px] glass-panel shadow-2xl space-y-8">
      <div>
        <h3 className="text-[10px] font-black text-zinc-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-anime-secondary" /> Score Distribution
        </h3>
        
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-panel p-2 rounded-xl text-[10px] font-black text-white shadow-2xl">
                        {payload[0].value?.toLocaleString('en-US')} Users
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name >= 80 ? '#9D4EDD' : entry.name >= 60 ? '#7B2FBE' : '#3c096c'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
            <Users className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">Members</span>
          </div>
          <p className="text-xl font-black text-white tabular-nums">
            {totalMembers.toLocaleString('en-US')}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
            <Heart className="w-3 h-3 text-red-500" />
            <span className="text-[8px] font-black uppercase tracking-widest">Favorites</span>
          </div>
          <p className="text-xl font-black text-white tabular-nums">
            {favorites?.toLocaleString('en-US') || '0'}
          </p>
        </div>
      </div>
    </div>
  );
}
