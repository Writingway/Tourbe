import { FC, ReactNode } from 'react';

interface QuizQuestionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  isLastStep?: boolean;
}

export const QuizQuestion: FC<QuizQuestionProps> = ({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  canProceed = true,
  isLastStep = false,
}) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gradient mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-cream-400 mb-8 text-sm md:text-base">
          {subtitle}
        </p>
      )}

      <div className="mb-8">{children}</div>

      <div className="flex justify-between items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="btn-secondary text-sm"
          >
            Retour
          </button>
        )}
        <div className="flex-1" />
        {onNext && (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`btn-primary text-sm ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLastStep ? 'Voir les résultats' : 'Suivant'}
          </button>
        )}
      </div>
    </div>
  );
};
