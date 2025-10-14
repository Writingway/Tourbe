import { FC } from 'react';
import type { TopRecommendation } from '../../hooks/useAdminAnalytics';

interface TopRecommendationsProps {
  recommendations: TopRecommendation[];
}

export const TopRecommendations: FC<TopRecommendationsProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-serif font-bold text-gold-400 mb-6">
          Top Recommandations
        </h3>
        <div className="text-center py-8">
          <p className="text-cream-400">Aucune recommandation disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-serif font-bold text-gold-400 mb-6">
        Top 10 Whiskies Recommandés
      </h3>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={rec.whiskyId}
            className="flex items-center gap-4 p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center">
              <span className="text-gold-400 font-bold text-sm">#{index + 1}</span>
            </div>

            {/* Whisky Info */}
            <div className="flex-1 min-w-0">
              <p className="text-cream-100 font-medium truncate">{rec.whiskyName}</p>
              <p className="text-cream-500 text-xs">
                {rec.count} recommandations • {rec.percentage}%
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex-shrink-0 w-24">
              <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-400 to-amber-600 rounded-full transition-all"
                  style={{ width: `${rec.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
