import { FC } from 'react';
import { getInsights } from '../lib/analytics';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

export const Insights: FC = () => {
  const insights = getInsights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Retour à l'accueil
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Statistiques analytiques
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Démarrages du quiz
            </h3>
            <p className="text-4xl font-bold text-whisky-600">
              {insights.quizStarts}
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Complétions du quiz
            </h3>
            <p className="text-4xl font-bold text-whisky-600">
              {insights.quizCompletes}
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Taux de complétion
            </h3>
            <p className="text-4xl font-bold text-whisky-600">
              {insights.completionRate}%
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Événements totaux
            </h3>
            <p className="text-4xl font-bold text-whisky-600">
              {insights.quizStarts + insights.quizCompletes}
            </p>
          </Card>
        </div>

        {insights.topStyles.length > 0 && (
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Préférences de style principales
            </h3>
            <div className="space-y-3">
              {insights.topStyles.map(([style, count]) => (
                <div
                  key={style}
                  className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-0"
                >
                  <span className="font-medium text-gray-800">{style}</span>
                  <span className="text-whisky-600 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
