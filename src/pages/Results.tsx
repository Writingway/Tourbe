import { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/useQuizStore';
import { ResultCard } from '../components/Results/ResultCard';
import { ParticleBackground } from '../components/3D/ParticleBackground';
import { PageTransition } from '../components/Animations/PageTransition';
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
      <PageTransition>
        <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
          <ParticleBackground />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center max-w-md glass-effect p-12 rounded-3xl"
          >
            <h2
              className="text-4xl font-bold text-gradient mb-6"
              style={{ fontFamily: 'var(--font-family-serif)' }}
            >
              Aucun résultat pour le moment
            </h2>
            <p className="text-copper-200 mb-8 text-lg">
              Répondez au quiz pour découvrir vos whiskies parfaits !
            </p>
            <motion.button
              onClick={() => (window.location.href = '/quiz')}
              className="copper-gradient px-10 py-4 rounded-full text-dark-950 font-bold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer le quiz
            </motion.button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen px-4 py-16">
        <ParticleBackground />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header with Pour Animation */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Decorative Glass Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-32 mx-auto relative">
                <div className="absolute inset-0 rounded-b-full border-4 border-copper-500/50 overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-whisky-500 to-whisky-400"
                    initial={{ height: '0%' }}
                    animate={{ height: '75%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  />
                  <div className="absolute inset-0 shimmer-effect" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-gradient mb-6"
              style={{ fontFamily: 'var(--font-family-serif)' }}
            >
              Vos whiskies parfaits
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-copper-200"
              style={{ fontFamily: 'var(--font-family-sans)' }}
            >
              D'après vos préférences, voici vos 3 meilleures recommandations
            </motion.p>
          </motion.div>

          {/* Results Cards with Stagger Animation */}
          <div className="space-y-8 mb-12">
            {results.map((match, index) => (
              <motion.div
                key={match.whisky.id}
                initial={{ opacity: 0, x: -50, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + index * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ResultCard match={match} rank={index + 1} />
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              onClick={handleTryAgain}
              className="px-10 py-4 rounded-full text-copper-300 font-medium border-2 border-copper-500/30 hover:border-copper-500/60 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Réessayer le quiz
            </motion.button>
            <motion.button
              onClick={() => (window.location.href = '/browse')}
              className="copper-gradient px-10 py-4 rounded-full text-dark-950 font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorer tous les whiskies
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};
