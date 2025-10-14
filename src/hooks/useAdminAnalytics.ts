import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  newUsersMonth: number;
  totalQuizzes: number;
  completedQuizzes: number;
  avgCompletionTime: number;
  completionRate: number;
}

export interface LevelDistribution {
  BEGINNER: number;
  INTERMEDIATE: number;
  CONNOISSEUR: number;
}

export interface TopRecommendation {
  whiskyId: string;
  whiskyName: string;
  count: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  users: number;
  quizzes: number;
}

export function useAdminAnalytics() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [levelDistribution, setLevelDistribution] = useState<LevelDistribution | null>(null);
  const [topRecommendations, setTopRecommendations] = useState<TopRecommendation[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadStats(),
        loadLevelDistribution(),
        loadTopRecommendations(),
        loadTimeSeries(),
      ]);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    // Charger les utilisateurs
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('created_at') as any;

    if (usersError) throw usersError;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newUsersToday = users.filter(
      (u: any) => new Date(u.created_at) >= today
    ).length;
    const newUsersWeek = users.filter(
      (u: any) => new Date(u.created_at) >= weekAgo
    ).length;
    const newUsersMonth = users.filter(
      (u: any) => new Date(u.created_at) >= monthAgo
    ).length;

    // Charger les quiz
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quiz_results')
      .select('completion_time') as any;

    if (quizzesError) throw quizzesError;

    const completedQuizzes = quizzes.filter((q: any) => q.completion_time !== null).length;
    const totalTime = quizzes.reduce((sum: any, q: any) => sum + (q.completion_time || 0), 0);
    const avgCompletionTime = completedQuizzes > 0 ? totalTime / completedQuizzes : 0;
    const completionRate = quizzes.length > 0 ? (completedQuizzes / quizzes.length) * 100 : 0;

    setStats({
      totalUsers: users.length,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      totalQuizzes: quizzes.length,
      completedQuizzes,
      avgCompletionTime: Math.round(avgCompletionTime),
      completionRate: Math.round(completionRate),
    });
  };

  const loadLevelDistribution = async () => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('user_level') as any;

    if (error) throw error;

    const distribution = {
      BEGINNER: 0,
      INTERMEDIATE: 0,
      CONNOISSEUR: 0,
    };

    data.forEach((result: any) => {
      if (result.user_level) {
        distribution[result.user_level as keyof LevelDistribution]++;
      }
    });

    setLevelDistribution(distribution);
  };

  const loadTopRecommendations = async () => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('recommendations') as any;

    if (error) throw error;

    // Compter les occurrences de chaque whisky
    const whiskyCount: Record<string, { name: string; count: number }> = {};

    data.forEach((result: any) => {
      const recommendations = result.recommendations as unknown;
      if (Array.isArray(recommendations)) {
        recommendations.forEach((rec: unknown) => {
          const recObj = rec as { whisky?: { id?: string; name?: string } };
          const whiskyId = recObj.whisky?.id;
          const whiskyName = recObj.whisky?.name;
          if (whiskyId && whiskyName) {
            if (!whiskyCount[whiskyId]) {
              whiskyCount[whiskyId] = { name: whiskyName, count: 0 };
            }
            whiskyCount[whiskyId].count++;
          }
        });
      }
    });

    const totalRecommendations = Object.values(whiskyCount).reduce(
      (sum, w) => sum + w.count,
      0
    );

    const top = Object.entries(whiskyCount)
      .map(([id, { name, count }]) => ({
        whiskyId: id,
        whiskyName: name,
        count,
        percentage: Math.round((count / totalRecommendations) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setTopRecommendations(top);
  };

  const loadTimeSeries = async () => {
    const { data: users } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: true }) as any;

    const { data: quizzes } = await supabase
      .from('quiz_results')
      .select('created_at')
      .order('created_at', { ascending: true }) as any;

    if (!users || !quizzes) return;

    // Créer une série temporelle des 30 derniers jours
    const now = new Date();
    const series: TimeSeriesData[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

      const usersCount = users.filter((u: any) => {
        const createdAt = new Date(u.created_at);
        return createdAt >= date && createdAt < nextDate;
      }).length;

      const quizzesCount = quizzes.filter((q: any) => {
        const createdAt = new Date(q.created_at);
        return createdAt >= date && createdAt < nextDate;
      }).length;

      series.push({
        date: dateStr,
        users: usersCount,
        quizzes: quizzesCount,
      });
    }

    setTimeSeries(series);
  };

  return {
    stats,
    levelDistribution,
    topRecommendations,
    timeSeries,
    isLoading,
    error,
    refresh: loadAnalytics,
  };
}
