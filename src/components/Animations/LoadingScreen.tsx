import { FC } from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950"
    >
      <div className="relative">
        {/* Glass Shape */}
        <motion.div
          className="relative w-32 h-40 rounded-b-full border-4 border-copper-500/30 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Liquid Fill Animation */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-whisky-500 to-whisky-400"
            initial={{ height: '0%' }}
            animate={{ height: '100%' }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />

          {/* Shimmer Effect */}
          <div className="absolute inset-0 shimmer-effect" />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="mt-8 text-center text-copper-300 font-serif text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Préparation de votre expérience...
        </motion.p>
      </div>
    </motion.div>
  );
};
