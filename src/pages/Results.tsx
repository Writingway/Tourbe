import { FC, useEffect, useState } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { ResultCard } from '../components/Results/ResultCard';
import { Navigation } from '../components/Navigation';
import { logEvent } from '../lib/analytics';
import { useAuth } from '../hooks/useAuth';
import { useQuizHistory } from '../hooks/useQuizHistory';
import { AuthModal } from '../components/Auth/AuthModal';

export const Results: FC = () => {
  const results = useQuizStore((state) => state.results);
  const answers = useQuizStore((state) => state.answers);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const { isAuthenticated } = useAuth();
  const { saveQuizResult } = useQuizHistory();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    logEvent('quiz_completed', { resultsCount: results.length });
  }, [results.length]);

  const handleTryAgain = () => {
    resetQuiz();
    window.location.href = '/quiz';
  };

  const handleSaveResults = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      await saveQuizResult(
        answers,
        results,
        answers.userLevel || 'BEGINNER',
        undefined // completion time, could be tracked
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving quiz results:', error);
      alert('Erreur lors de la sauvegarde des résultats');
    } finally {
      setIsSaving(false);
    }
  };

  if (results.length === 0) {
    return (
      <div className="min-h-screen textured-bg">
        <Navigation currentPath="/results" />
        <div className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md card p-12">
            <h2 className="text-4xl font-serif font-bold text-gradient mb-4">
              Aucun résultat
            </h2>
            <p className="text-cream-300 mb-8">
              Répondez au quiz pour découvrir vos whiskies parfaits !
            </p>
            <button
              onClick={() => (window.location.href = '/quiz')}
              className="btn-primary"
            >
              Commencer le quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen textured-bg">
      <Navigation currentPath="/results" />

      <div className="px-4 py-24 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-24 border-4 border-gold-400 rounded-b-full relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-amber-600 to-amber-400"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gradient mb-4">
            Vos whiskies parfaits
          </h1>
          <p className="text-cream-300 text-lg">
            D'après vos préférences, voici vos 3 meilleures recommandations
          </p>
        </div>

        {/* Results Cards */}
        <div className="space-y-6 mb-12">
          {results.map((match, index) => (
            <ResultCard key={match.whisky.id} match={match} rank={index + 1} />
          ))}
        </div>

        {/* Save Results Section */}
        {isAuthenticated ? (
          <div className="mb-8 text-center">
            {isSaved ? (
              <div className="card p-6 bg-green-500/10 border-green-500/30">
                <p className="text-green-400 font-medium">✅ Résultats sauvegardés avec succès !</p>
              </div>
            ) : (
              <button
                onClick={handleSaveResults}
                disabled={isSaving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Sauvegarde...' : '💾 Sauvegarder mes résultats'}
              </button>
            )}
          </div>
        ) : (
          <div className="mb-8 card p-6 text-center">
            <p className="text-cream-300 mb-4">
              Connectez-vous pour sauvegarder vos résultats et accéder à votre historique
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-primary"
            >
              Se connecter / S'inscrire
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleTryAgain}
            className="btn-secondary"
          >
            Réessayer le quiz
          </button>
          <button
            onClick={() => (window.location.href = '/browse')}
            className="btn-primary"
          >
            Explorer tous les whiskies
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
      />
    </div>
  );
};
