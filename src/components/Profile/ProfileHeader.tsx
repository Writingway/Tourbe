import { FC } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Profile } from '../../lib/database.types';

interface ProfileHeaderProps {
  profile: Profile;
  onEdit: () => void;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ profile, onEdit }) => {
  const memberSince = format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr });

  return (
    <div className="card p-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-3xl font-bold text-dark-950">
            {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-serif font-bold text-cream-100 mb-2">
              {profile.full_name || 'Utilisateur'}
            </h1>
            <p className="text-cream-400 mb-1">{profile.email}</p>
            <p className="text-cream-500 text-sm">
              Membre depuis {memberSince}
            </p>
            {profile.role === 'admin' && (
              <span className="inline-block mt-2 px-3 py-1 bg-gold-400/20 border border-gold-400/40 rounded-full text-xs text-gold-400 font-medium">
                Administrateur
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium transition-all"
        >
          Modifier le profil
        </button>
      </div>
    </div>
  );
};
