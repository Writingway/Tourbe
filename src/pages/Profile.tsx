import { FC, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileEdit } from '../components/Profile/ProfileEdit';
import { QuizHistory } from '../components/Profile/QuizHistory';
import { useAuth } from '../hooks/useAuth';
import { useQuizHistory } from '../hooks/useQuizHistory';
import { useProfile } from '../hooks/useProfile';
import { Dialog } from '@headlessui/react';

export const Profile: FC = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

const ProfileContent: FC = () => {
  const { profile, signOut } = useAuth();
  const { deleteAccount, isDeleting } = useProfile();
  const { results, isLoading } = useQuizHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleRetakeQuiz = () => {
    window.location.href = '/quiz';
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen textured-bg">
      <Navigation currentPath="/profile" />

      <div className="max-w-6xl mx-auto px-4 py-12 mt-7">
        {/* Header ou Edit */}
        {isEditing ? (
          <ProfileEdit
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        ) : (
          <ProfileHeader profile={profile} onEdit={() => setIsEditing(true)} />
        )}

        {/* Quiz History */}
        <div className="mt-8">
          {isLoading ? (
            <div className="card p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-cream-400">Chargement de l'historique...</p>
            </div>
          ) : (
            <QuizHistory results={results} onRetake={handleRetakeQuiz} />
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-serif font-bold text-cream-100 mb-4">
            Actions du compte
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSignOut}
              className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 border border-gold-400/30 rounded-full text-cream-200 font-medium transition-all"
            >
              Se déconnecter
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full text-red-400 font-medium transition-all"
            >
              Supprimer mon compte
            </button>
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="card max-w-md w-full p-8">
            <Dialog.Title className="text-2xl font-serif font-bold text-red-400 mb-4">
              Supprimer le compte
            </Dialog.Title>
            <p className="text-cream-300 mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et
              toutes vos données seront définitivement supprimées.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 border border-gold-400/30 rounded-full text-cream-200 font-medium transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
