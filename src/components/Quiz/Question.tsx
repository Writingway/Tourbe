import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface QuestionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  isLastStep?: boolean;
}

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const Question: FC<QuestionProps> = ({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  canProceed = true,
  isLastStep = false,
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="max-w-4xl mx-auto"
    >
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2
          className="text-4xl md:text-5xl font-bold text-gradient mb-4"
          style={{ fontFamily: 'var(--font-family-serif)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-copper-200" style={{ fontFamily: 'var(--font-family-sans)' }}>
            {subtitle}
          </p>
        )}
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {children}
      </motion.div>

      <motion.div
        className="flex gap-6 justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {onBack ? (
          <motion.button
            onClick={onBack}
            className="px-8 py-4 rounded-full text-copper-300 font-medium border border-copper-500/30 hover:border-copper-500/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retour
          </motion.button>
        ) : (
          <div />
        )}
        <motion.button
          onClick={onNext}
          disabled={!canProceed}
          className={`relative px-12 py-4 rounded-full font-semibold overflow-hidden ${
            canProceed
              ? 'copper-gradient text-dark-950'
              : 'bg-dark-800 text-dark-700 cursor-not-allowed'
          }`}
          whileHover={canProceed ? { scale: 1.05 } : {}}
          whileTap={canProceed ? { scale: 0.95 } : {}}
        >
          {isLastStep ? 'Voir mes résultats' : 'Suivant'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
