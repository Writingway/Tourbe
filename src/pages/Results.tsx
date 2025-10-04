import { FC, useEffect } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { ResultCard } from '../components/Results/ResultCard';
import { Button } from '../components/UI/Button';
import { logEvent } from '../lib/analytics';

export const Results: FC = () => {
  const results = useQuizStore((state) => state.results);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  useEffect(() => {
    logEvent('quiz_completed', { resultsCount: results.length });
  }, [results.length]);

  const handleTryAgain = () => {
    resetQuiz();
    window.location.href = '/quiz';
  };

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No results yet
          </h2>
          <p className="text-gray-600 mb-6">
            Take the quiz to discover your perfect whisky matches!
          </p>
          <Button variant="primary" onClick={() => (window.location.href = '/quiz')}>
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Perfect Whisky Matches
          </h1>
          <p className="text-xl text-gray-600">
            Based on your preferences, here are your top 3 recommendations
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {results.map((match, index) => (
            <ResultCard key={match.whisky.id} match={match} rank={index + 1} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={handleTryAgain}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
};
