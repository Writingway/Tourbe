import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { QuizResult } from '../lib/database.types';
import { useAuth } from './useAuth';

export function useQuizHistory() {
  const { user } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    loadQuizHistory();
  }, [user]);

  const loadQuizHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setResults(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading quiz history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuizResult = async (
    quizData: object,
    recommendations: object,
    userLevel: 'BEGINNER' | 'INTERMEDIATE' | 'CONNOISSEUR',
    completionTime?: number
  ) => {
    if (!user) throw new Error('User must be authenticated to save quiz results');

    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        quiz_data: quizData as any,
        recommendations: recommendations as any,
        user_level: userLevel,
        completion_time: completionTime || null,
      } as any)
      .select()
      .single();

    if (error) throw error;

    // Recharger l'historique
    await loadQuizHistory();

    return data;
  };

  return {
    results,
    isLoading,
    error,
    saveQuizResult,
    refresh: loadQuizHistory,
  };
}
