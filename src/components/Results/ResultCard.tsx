import { FC, useState } from 'react';
import { ScoreBreakdown } from './ScoreBreakdown';
import type { WhiskyMatch } from '../../lib/scoring.types';

interface ResultCardProps {
  match: WhiskyMatch;
  rank: number;
}

export const ResultCard: FC<ResultCardProps> = ({ match, rank }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { whisky, score, breakdown } = match;

  const handleViewDistillery = () => {
    window.location.href = `/map?id=${whisky.id}`;
  };

  const getRankBadge = () => {
    const badges = {
      1: { icon: '🥇', bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600' },
      2: { icon: '🥈', bg: 'bg-gradient-to-br from-gray-300 to-gray-500' },
      3: { icon: '🥉', bg: 'bg-gradient-to-br from-orange-400 to-orange-600' },
    };
    return badges[rank as keyof typeof badges] || { icon: `#${rank}`, bg: 'bg-amber-700' };
  };

  const badge = getRankBadge();

  return (
    <div className="card hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className={`w-14 h-14 rounded-full ${badge.bg} flex items-center justify-center shadow-lg border-2 border-dark-950`}>
          <span className="text-xl font-bold text-dark-950">{badge.icon}</span>
        </div>
      </div>

      {/* Score Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="px-4 py-2 rounded-full bg-gold-400 text-dark-950 font-bold text-sm shadow-lg">
          {score.toFixed(0)}% match
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-8 pt-20 md:pt-8">
        {/* Whisky Image */}
        <div className="md:w-64 flex-shrink-0">
          <div className="relative h-64 md:h-full bg-dark-700 rounded-lg overflow-hidden">
            <img
              src={whisky.image}
              alt={whisky.name}
              className="w-full h-full object-contain p-4"
            />
          </div>
        </div>

        {/* Whisky Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-gradient mb-2">
              {whisky.name}
            </h3>
            <p className="text-amber-300 text-lg font-medium">
              {whisky.distillery}
            </p>
            <p className="text-cream-400 text-sm">
              {whisky.region.split('_').join(' ')}
            </p>
          </div>

          {/* Key Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-cream-300">
              <span>🌡</span>
              <span className="font-medium">{whisky.abv}% ABV</span>
            </div>
            <div className="flex items-center gap-2 text-cream-300">
              <span>💰</span>
              <span className="font-medium">
                {whisky.priceBand === 'UNDER_40'
                  ? 'Moins de 40€'
                  : whisky.priceBand === '40_70'
                    ? '40-70€'
                    : whisky.priceBand === '70_120'
                      ? '70-120€'
                      : 'Plus de 120€'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-cream-300">
              <span>🔥</span>
              <span className="font-medium">{whisky.intensity}</span>
            </div>
          </div>

          {/* Tasting Note */}
          <p className="text-cream-200 italic leading-relaxed">
            "{whisky.tastingNoteShort}"
          </p>

          {/* Style Tags */}
          <div className="flex flex-wrap gap-2">
            {whisky.style.slice(0, 6).map((style) => (
              <span key={style} className="tag">
                {style.split('_').join(' ').toLowerCase()}
              </span>
            ))}
          </div>

          {/* Score Breakdown */}
          {showBreakdown && (
            <div className="pt-4 border-t border-amber-900/30">
              <ScoreBreakdown breakdown={breakdown} />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="btn-secondary text-sm"
            >
              {showBreakdown ? 'Masquer détails' : 'Pourquoi ce match ?'}
            </button>
            <button
              onClick={handleViewDistillery}
              className="btn-primary text-sm"
            >
              Voir la distillerie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
