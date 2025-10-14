import { FC } from 'react';
import { Navigation } from '../components/Navigation';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { DashboardStats } from '../components/Admin/DashboardStats';
import { QuizAnalytics } from '../components/Admin/QuizAnalytics';
import { TopRecommendations } from '../components/Admin/TopRecommendations';
import { TimeSeriesChart } from '../components/Admin/TimeSeriesChart';
import { useAdminAnalytics } from '../hooks/useAdminAnalytics';

export const AdminDashboard: FC = () => {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

const AdminDashboardContent: FC = () => {
  const {
    stats,
    levelDistribution,
    topRecommendations,
    timeSeries,
    isLoading,
    error,
    refresh,
  } = useAdminAnalytics();

  if (error) {
    return (
      <div className="min-h-screen textured-bg">
        <Navigation currentPath="/admin" />
        <div className="max-w-7xl mx-auto px-4 py-12 mt-7">
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-serif font-bold text-red-400 mb-4">
              Erreur de chargement
            </h2>
            <p className="text-cream-300 mb-6">{error.message}</p>
            <button onClick={refresh} className="btn-primary">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen textured-bg">
        <Navigation currentPath="/admin" />
        <div className="max-w-7xl mx-auto px-4 py-12 mt-7">
          <div className="card p-8 text-center">
            <div className="inline-block w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cream-300">Chargement des analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen textured-bg">
      <Navigation currentPath="/admin" />

      <div className="max-w-7xl mx-auto px-4 py-12 mt-7">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-2">
                Tableau de Bord
              </h1>
              <p className="text-cream-300 text-lg">
                Statistiques et analytics de l'application
              </p>
            </div>
            <button
              onClick={refresh}
              className="px-6 py-3 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 rounded-full text-gold-400 font-medium transition-all"
            >
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="mb-8">
            <DashboardStats stats={stats} />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Level Distribution */}
          {levelDistribution && (
            <QuizAnalytics levelDistribution={levelDistribution} />
          )}

          {/* Top Recommendations */}
          <TopRecommendations recommendations={topRecommendations} />
        </div>

        {/* Time Series Chart */}
        {timeSeries.length > 0 && (
          <div className="mb-8">
            <TimeSeriesChart data={timeSeries} />
          </div>
        )}

        {/* Additional Info */}
        <div className="card p-6">
          <h3 className="text-lg font-serif font-bold text-cream-100 mb-4">
            Informations supplémentaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-cream-500 mb-1">Total quiz lancés</p>
              <p className="text-2xl font-bold text-cream-100">{stats?.totalQuizzes || 0}</p>
            </div>
            <div>
              <p className="text-cream-500 mb-1">Quiz complétés</p>
              <p className="text-2xl font-bold text-cream-100">{stats?.completedQuizzes || 0}</p>
            </div>
            <div>
              <p className="text-cream-500 mb-1">Taux d'abandon</p>
              <p className="text-2xl font-bold text-cream-100">
                {stats ? 100 - stats.completionRate : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="btn-secondary"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
