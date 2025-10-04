import { FC } from 'react';
import { DistilleryMap } from '../components/Map/DistilleryMap';
import { Button } from '../components/UI/Button';

export const Map: FC = () => {
  const params = new URLSearchParams(window.location.search);
  const whiskyId = params.get('id') || undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/results')}
          >
            Retour aux résultats
          </Button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Carte des distilleries
          </h1>
          <p className="text-gray-600">
            Explorez l'origine de vos meilleures correspondances
          </p>
        </div>

        <DistilleryMap selectedWhiskyId={whiskyId} />
      </div>
    </div>
  );
};
