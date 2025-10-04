import { FC } from 'react';
import { motion } from 'framer-motion';

interface LiquidProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const LiquidProgress: FC<LiquidProgressProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="relative w-full h-3 bg-dark-800 rounded-full overflow-hidden">
      {/* Liquid Fill */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-whisky-500 to-copper-500 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 shimmer-effect opacity-50" />

        {/* Liquid Wave Effect */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 10"
        >
          <motion.path
            d="M0 5 Q 25 2, 50 5 T 100 5 V 10 H 0 Z"
            fill="rgba(255, 255, 255, 0.2)"
            animate={{
              d: [
                'M0 5 Q 25 2, 50 5 T 100 5 V 10 H 0 Z',
                'M0 5 Q 25 8, 50 5 T 100 5 V 10 H 0 Z',
                'M0 5 Q 25 2, 50 5 T 100 5 V 10 H 0 Z',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      {/* Step Indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white drop-shadow-lg">
          {currentStep} / {totalSteps}
        </span>
      </div>
    </div>
  );
};
