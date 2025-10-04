import { FC, useEffect } from 'react';
import { QuizShell } from '../components/Quiz/QuizShell';
import { logEvent } from '../lib/analytics';

export const Quiz: FC = () => {
  useEffect(() => {
    logEvent('quiz_started');
  }, []);

  return <QuizShell />;
};
