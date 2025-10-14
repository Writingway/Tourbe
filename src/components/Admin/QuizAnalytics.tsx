import { FC } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { LevelDistribution } from '../../hooks/useAdminAnalytics';

interface QuizAnalyticsProps {
  levelDistribution: LevelDistribution;
}

export const QuizAnalytics: FC<QuizAnalyticsProps> = ({ levelDistribution }) => {
  const data = [
    { name: 'Débutant', value: levelDistribution.BEGINNER, color: '#10b981' },
    { name: 'Intermédiaire', value: levelDistribution.INTERMEDIATE, color: '#3b82f6' },
    { name: 'Connaisseur', value: levelDistribution.CONNOISSEUR, color: '#8b5cf6' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card p-6">
      <h3 className="text-xl font-serif font-bold text-gold-400 mb-6">
        Répartition par niveau
      </h3>

      {total === 0 ? (
        <div className="text-center py-8">
          <p className="text-cream-400">Aucune donnée disponible</p>
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2c2c2c',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px',
                    color: '#f5e6d3',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {data.map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-sm font-medium text-cream-300">{item.name}</p>
                <p className="text-2xl font-bold text-cream-100">{item.value}</p>
                <p className="text-xs text-cream-500">
                  {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
