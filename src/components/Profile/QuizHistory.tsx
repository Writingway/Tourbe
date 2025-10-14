import { FC } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { QuizResult } from '../../lib/database.types';
import type { WhiskyMatch } from '../../lib/scoring.types';

interface QuizHistoryProps {
  results: QuizResult[];
  onRetake?: () => void;
}

export const QuizHistory: FC<QuizHistoryProps> = ({ results, onRetake }) => {
  if (results.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-6xl mb-4">🥃</div>
        <h3 className="text-xl font-serif font-bold text-cream-100 mb-2">
          Aucun quiz complété
        </h3>
        <p className="text-cream-400 mb-6">
          Passez votre premier quiz pour découvrir les whiskies qui vous correspondent !
        </p>
        <button
          onClick={onRetake}
          className="btn-primary"
        >
          Commencer le quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-gradient">
          Historique des recommandations
        </h2>
        <button
          onClick={onRetake}
          className="px-4 py-2 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium transition-all"
        >
          Nouveau quiz
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <QuizResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
};

interface QuizResultCardProps {
  result: QuizResult;
}

const QuizResultCard: FC<QuizResultCardProps> = ({ result }) => {
  const recommendations = result.recommendations as unknown as WhiskyMatch[];
  const date = format(new Date(result.created_at), 'dd MMMM yyyy', { locale: fr });

  const getLevelBadge = (level: string | null) => {
    if (!level) return null;

    const colors = {
      BEGINNER: 'bg-green-400/10 border-green-400/30 text-green-400',
      INTERMEDIATE: 'bg-blue-400/10 border-blue-400/30 text-blue-400',
      CONNOISSEUR: 'bg-purple-400/10 border-purple-400/30 text-purple-400',
    };

    const labels = {
      BEGINNER: 'Débutant',
      INTERMEDIATE: 'Intermédiaire',
      CONNOISSEUR: 'Connaisseur',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[level as keyof typeof colors]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="card p-6 hover:scale-[1.01] transition-transform">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-cream-500 text-sm mb-1">{date}</p>
          <div className="flex items-center gap-2">
            {result.user_level && getLevelBadge(result.user_level)}
            {result.completion_time && (
              <span className="text-cream-500 text-xs">
                • {Math.floor(result.completion_time / 60)} min
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-cream-300 mb-2">
          Top 3 recommandations :
        </h3>
        {recommendations.slice(0, 3).map((match, idx) => (
          <div
            key={match.whisky.id}
            className="flex items-center gap-4 p-3 bg-dark-700/50 rounded-lg"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-sm">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream-100 font-medium truncate">
                {match.whisky.name}
              </p>
              <p className="text-cream-500 text-xs truncate">
                {match.whisky.distillery}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="px-3 py-1 bg-gold-400/10 border border-gold-400/30 rounded-full text-xs text-gold-400 font-medium">
                {match.totalScore}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
