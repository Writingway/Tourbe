import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { ScoreBreakdown } from './ScoreBreakdown';
import type { WhiskyMatch } from '../../lib/scoring.types';

interface ResultCardProps {
  match: WhiskyMatch;
  rank: number;
}

export const ResultCard: FC<ResultCardProps> = ({ match, rank }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { whisky, score, breakdown } = match;

  const handleViewDistillery = () => {
    window.location.href = `/map?id=${whisky.id}`;
  };

  const medalColors = {
    1: 'from-yellow-400 to-yellow-600',
    2: 'from-gray-300 to-gray-500',
    3: 'from-orange-400 to-orange-600',
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        rotateY: 2,
        z: 50,
      }}
      className="glass-effect rounded-3xl overflow-hidden relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Rank Badge */}
      <div className="absolute top-6 left-6 z-20">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${medalColors[rank as keyof typeof medalColors] || 'from-copper-400 to-copper-600'} flex items-center justify-center shadow-2xl border-4 border-dark-950/50`}
        >
          <span className="text-2xl font-bold text-dark-950">#{rank}</span>
        </div>
      </div>

      {/* Shimmer Effect on Hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 shimmer-effect pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <div className="flex flex-col md:flex-row gap-6 p-8">
        <div className="md:w-48 h-48 flex-shrink-0">
          <img
            src={whisky.image}
            alt={whisky.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 relative z-20">
          <div className="mb-4">
            {/* Score Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-copper-500/20 border border-copper-500/30 mb-3">
              <motion.div
                className="w-2 h-2 rounded-full bg-copper-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-copper-300 font-bold text-lg">
                {score.toFixed(1)}% de correspondance
              </span>
            </div>

            <h3
              className="text-3xl md:text-4xl font-bold text-gradient mb-2"
              style={{ fontFamily: 'var(--font-family-serif)' }}
            >
              {whisky.name}
            </h3>
            <p className="text-copper-200 text-lg">
              {whisky.distillery} • {whisky.region.split('_').join(' ')}
            </p>
          </div>

          <div className="flex gap-6 text-sm text-copper-300 mb-4">
            <span className="flex items-center gap-2">
              <span className="text-copper-500">🌡</span> {whisky.abv}% ABV
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <span className="text-copper-500">💰</span>
              {whisky.priceBand === 'UNDER_40'
                ? 'Moins de 40€'
                : whisky.priceBand === '40_70'
                  ? '40€-70€'
                  : whisky.priceBand === '70_120'
                    ? '70€-120€'
                    : 'Plus de 120€'}
            </span>
          </div>

          <p className="text-copper-100 mb-6 italic text-lg leading-relaxed">
            "{whisky.tastingNoteShort}"
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {whisky.style.slice(0, 6).map((style, idx) => (
              <motion.span
                key={style}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-1 rounded-full bg-dark-800 text-copper-200 text-sm border border-copper-500/20"
              >
                {style.split('_').join(' ')}
              </motion.span>
            ))}
          </div>

          <div className="space-y-4">
            {showBreakdown && <ScoreBreakdown breakdown={breakdown} />}

            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="px-6 py-3 rounded-full glass-effect text-copper-200 font-medium border border-copper-500/30 hover:border-copper-500/60 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showBreakdown ? 'Masquer les détails' : 'Pourquoi ce match ?'}
              </motion.button>
              <motion.button
                onClick={handleViewDistillery}
                className="copper-gradient px-6 py-3 rounded-full text-dark-950 font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir la distillerie
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
