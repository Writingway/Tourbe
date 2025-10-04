import { FC, ReactNode } from 'react';
import { Button } from '../UI/Button';

interface QuestionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  isLastStep?: boolean;
}

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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
      </div>

      <div className="mb-8">{children}</div>

      <div className="flex gap-4 justify-between">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          {isLastStep ? 'Voir mes résultats' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
};
