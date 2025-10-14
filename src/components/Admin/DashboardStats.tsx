import { FC } from 'react';
import type { AdminStats } from '../../hooks/useAdminAnalytics';

interface DashboardStatsProps {
  stats: AdminStats;
}

export const DashboardStats: FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: stats.totalUsers,
      subtitle: `+${stats.newUsersToday} aujourd'hui`,
      icon: '👥',
      color: 'gold',
    },
    {
      title: 'Quiz complétés',
      value: stats.completedQuizzes,
      subtitle: `${stats.completionRate}% de taux de complétion`,
      icon: '📝',
      color: 'blue',
    },
    {
      title: 'Temps moyen',
      value: `${Math.floor(stats.avgCompletionTime / 60)} min`,
      subtitle: 'Pour compléter le quiz',
      icon: '⏱️',
      color: 'purple',
    },
    {
      title: 'Nouveaux utilisateurs',
      value: stats.newUsersWeek,
      subtitle: 'Cette semaine',
      icon: '🆕',
      color: 'green',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="card p-6 hover:scale-[1.02] transition-transform">
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">{stat.icon}</div>
            <div className={`w-2 h-2 rounded-full bg-${stat.color}-400`}></div>
          </div>
          <h3 className="text-sm font-medium text-cream-400 mb-1">{stat.title}</h3>
          <p className="text-3xl font-bold text-cream-100 mb-1">{stat.value}</p>
          <p className="text-xs text-cream-500">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
