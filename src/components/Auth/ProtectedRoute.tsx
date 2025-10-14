import { FC, ReactNode, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  fallback,
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Rediriger vers la page d'accueil avec modal d'auth
      window.location.href = '/?auth=login';
    } else if (!isLoading && requireAdmin && !isAdmin) {
      // Rediriger vers la page d'accueil si pas admin
      window.location.href = '/';
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen textured-bg flex items-center justify-center">
        <div className="card p-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cream-300">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
