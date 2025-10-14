import { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { TimeSeriesData } from '../../hooks/useAdminAnalytics';

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

export const TimeSeriesChart: FC<TimeSeriesChartProps> = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'dd MMM', { locale: fr }),
  }));

  return (
    <div className="card p-6">
      <h3 className="text-xl font-serif font-bold text-gold-400 mb-6">
        Évolution (30 derniers jours)
      </h3>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-cream-400">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
              <XAxis
                dataKey="dateFormatted"
                stroke="#f5e6d3"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#f5e6d3' }}
              />
              <YAxis
                stroke="#f5e6d3"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#f5e6d3' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2c2c2c',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#f5e6d3',
                }}
              />
              <Legend
                wrapperStyle={{ color: '#f5e6d3' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="users"
                name="Nouveaux utilisateurs"
                stroke="#d4af37"
                strokeWidth={2}
                dot={{ fill: '#d4af37', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="quizzes"
                name="Quiz complétés"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
