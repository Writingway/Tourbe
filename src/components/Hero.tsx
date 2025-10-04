import { FC, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { ParticleBackground } from './3D/ParticleBackground';
import { WhiskyBottle } from './3D/WhiskyBottle';
import { PageTransition } from './Animations/PageTransition';
import { useQuizStore } from '../store/useQuizStore';

export const Hero: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleStartQuiz = () => {
    resetQuiz();
    window.location.href = '/quiz';
  };

  return (
    <>
      <PageTransition>
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Particle Background */}
          <ParticleBackground />

          {/* 3D Bottle Background */}
          <div className="absolute inset-0 opacity-20">
            <WhiskyBottle />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-transparent to-dark-950 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/50 via-transparent to-dark-950/50 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-6xl w-full px-4 py-12 text-center">
            {/* Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-family-serif)' }}
            >
              <span className="text-gradient">
                Fini les hésitations
              </span>
              <br />
              <span className="text-white">
                découvrez le whisky
              </span>
              <br />
              <span className="text-gradient">
                fait pour vous
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-copper-200 mb-12 max-w-3xl mx-auto"
              style={{ fontFamily: 'var(--font-family-sans)' }}
            >
              Répondez à quelques questions simples et trouvez votre whisky idéal parmi notre sélection premium
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {/* Primary CTA with Ripple Effect */}
              <motion.button
                onHoverStart={() => setButtonHover(true)}
                onHoverEnd={() => setButtonHover(false)}
                onClick={handleStartQuiz}
                className="relative px-12 py-5 rounded-full font-semibold text-lg overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 copper-gradient" />
                {buttonHover && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 text-dark-950 font-bold">
                  Trouver mon whisky
                </span>
              </motion.button>

              {/* Secondary Buttons */}
              <motion.button
                onClick={() => (window.location.href = '/browse')}
                className="glass-effect px-8 py-4 rounded-full text-copper-200 font-medium hover:bg-glass-light transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Parcourir la collection
              </motion.button>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 rounded-full text-copper-300 font-medium border border-copper-500/30 hover:border-copper-500/60 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Comment ça marche
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 rounded-full border-2 border-copper-500/50 flex items-start justify-center p-2"
              >
                <motion.div className="w-1.5 h-3 bg-copper-500 rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageTransition>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-effect max-w-md rounded-2xl p-8"
            >
              <Dialog.Title
                className="text-3xl font-bold text-gradient mb-6"
                style={{ fontFamily: 'var(--font-family-serif)' }}
              >
                Comment ça marche
              </Dialog.Title>
              <ul className="space-y-6 text-left text-copper-100">
                {[
                  {
                    num: '1',
                    text: "Répondez aux questions sur vos préférences gustatives, des profils aromatiques à l'intensité et à la finale",
                  },
                  {
                    num: '2',
                    text: 'Notre algorithme analyse vos réponses parmi 101 whiskies soigneusement sélectionnés',
                  },
                  {
                    num: '3',
                    text: 'Obtenez des recommandations personnalisées avec scores de correspondance et notes de dégustation détaillés',
                  },
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                    className="flex gap-4"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-copper-500 flex items-center justify-center font-bold text-dark-950">
                      {item.num}
                    </span>
                    <span className="pt-1">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full copper-gradient px-8 py-4 rounded-full text-dark-950 font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Compris
                </motion.button>
              </div>
            </motion.div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
