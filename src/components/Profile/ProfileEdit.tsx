import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Profile } from '../../lib/database.types';
import { useProfile } from '../../hooks/useProfile';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditProps {
  profile: Profile;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ProfileEdit: FC<ProfileEditProps> = ({ profile, onCancel, onSuccess }) => {
  const { updateProfile, isUpdating } = useProfile();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);

    try {
      await updateProfile(data);
      onSuccess();
    } catch (err) {
      setError((err as Error).message || 'Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-serif font-bold text-gradient mb-6">
        Modifier le profil
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-cream-300 mb-2">
            Nom complet
          </label>
          <input
            {...register('full_name')}
            type="text"
            id="full_name"
            className="w-full px-4 py-3 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
            placeholder="Votre nom"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cream-300 mb-2">
            Adresse email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full px-4 py-3 bg-dark-700/50 border border-gold-400/10 rounded-lg text-cream-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-cream-500">
            L'email ne peut pas être modifié
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 border border-gold-400/30 rounded-full text-cream-200 font-medium transition-all"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};
