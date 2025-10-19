import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAnswers, WhiskyMatch } from '../lib/scoring.types';

interface QuizState {
  currentStep: number;
  answers: QuizAnswers;
  results: WhiskyMatch[];
  totalQuestions: number;
  isCompleted: boolean;
  setCurrentStep: (step: number) => void;
  updateAnswers: (partial: Partial<QuizAnswers>) => void;
  setResults: (results: WhiskyMatch[]) => void;
  setTotalQuestions: (total: number) => void;
  markQuizCompleted: () => void;
  resetQuiz: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialAnswers: QuizAnswers = {
  userLevel: null,
  styleTags: [],
  intensity: null,
  mouthfeel: [],
  finishLength: null,
  finishNotes: [],
  regions: [],
  budget: [],
  openness: null,
  abvComfort: null,
  caskType: null,
  peatLevel: null,
  whiskyAge: null,
  whiskyType: null,
  productType: null,
  finishType: null,
  flavorProfile: null,
  usage: null,
  originPreference: null,
  limitedEditions: null,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      currentStep: 0,
      answers: initialAnswers,
      results: [],
      totalQuestions: 0,
      isCompleted: false,
      setCurrentStep: (step) => set({ currentStep: step }),
      updateAnswers: (partial) =>
        set((state) => ({
          answers: { ...state.answers, ...partial },
        })),
      setResults: (results) => {
        console.log('Setting results:', results.length);
        set({ results });
      },
      setTotalQuestions: (total) => set({ totalQuestions: total }),
      markQuizCompleted: () => set({ isCompleted: true }),
      resetQuiz: () => set({ 
        currentStep: 0, 
        answers: initialAnswers, 
        results: [], 
        totalQuestions: 0,
        isCompleted: false 
      }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
    }),
    {
      name: 'whisky-quiz-storage',
    }
  )
);
