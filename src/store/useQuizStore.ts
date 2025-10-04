import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAnswers, WhiskyMatch } from '../lib/scoring.types';

interface QuizState {
  currentStep: number;
  answers: QuizAnswers;
  results: WhiskyMatch[];
  setCurrentStep: (step: number) => void;
  updateAnswers: (partial: Partial<QuizAnswers>) => void;
  setResults: (results: WhiskyMatch[]) => void;
  resetQuiz: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialAnswers: QuizAnswers = {
  styleTags: [],
  intensity: null,
  mouthfeel: [],
  finishLength: null,
  finishNotes: [],
  regions: [],
  budget: [],
  openness: null,
  abvComfort: null,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      currentStep: 0,
      answers: initialAnswers,
      results: [],
      setCurrentStep: (step) => set({ currentStep: step }),
      updateAnswers: (partial) =>
        set((state) => ({
          answers: { ...state.answers, ...partial },
        })),
      setResults: (results) => {
        console.log('Setting results:', results.length);
        set({ results });
      },
      resetQuiz: () => set({ currentStep: 0, answers: initialAnswers, results: [] }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
    }),
    {
      name: 'whisky-quiz-storage',
    }
  )
);
