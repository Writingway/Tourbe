import { FC, useState } from 'react';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
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

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 h-48 flex-shrink-0">
          <img
            src={whisky.image}
            alt={whisky.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="success" className="text-xs">
                  Match #{rank}
                </Badge>
                <Badge variant="warning" className="text-xs">
                  {score.toFixed(1)}% Correspondance
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {whisky.name}
              </h3>
              <p className="text-gray-600">
                {whisky.distillery} • {whisky.region.split('_').join(' ')}
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-gray-600 mb-3">
            <span>Degré : {whisky.abv}%</span>
            <span>•</span>
            <span>
              Prix :{' '}
              {whisky.priceBand === 'UNDER_40'
                ? 'Moins de 40€'
                : whisky.priceBand === '40_70'
                  ? '40€-70€'
                  : whisky.priceBand === '70_120'
                    ? '70€-120€'
                    : 'Plus de 120€'}
            </span>
          </div>

          <p className="text-gray-700 mb-4 italic">
            "{whisky.tastingNoteShort}"
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {whisky.style.slice(0, 6).map((style) => (
              <Badge key={style} variant="default">
                {style.split('_').join(' ')}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            {showBreakdown && <ScoreBreakdown breakdown={breakdown} />}

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                {showBreakdown ? 'Masquer les détails' : 'Pourquoi ce match ?'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleViewDistillery}>
                Voir la distillerie
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
