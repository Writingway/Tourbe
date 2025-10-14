import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email requis')
    .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
      message: 'Email invalide',
    }),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(data);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gradient mb-2">
          Connexion
        </h2>
        <p className="text-cream-400 text-sm">
          Bienvenue ! Connectez-vous pour accéder à votre profil
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-cream-300 mb-2">
          Adresse email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
          placeholder="votre@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-cream-300 mb-2">
          Mot de passe
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-4 py-3 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
        >
          Pas encore de compte ? Inscrivez-vous
        </button>
      </div>
    </form>
  );
};
