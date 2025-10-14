import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const signupSchema = z.object({
  email: z.string()
    .min(1, 'Email requis')
    .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
      message: 'Email invalide',
    }),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignupForm: FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-serif font-bold text-gradient">
          Inscription réussie !
        </h2>
        <p className="text-cream-400">
          Un email de confirmation a été envoyé à votre adresse.
          <br />
          Veuillez vérifier votre boîte de réception.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gradient mb-2">
          Inscription
        </h2>
        <p className="text-cream-400 text-sm">
          Créez un compte pour sauvegarder vos recommandations
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-cream-300 mb-2">
          Nom complet
        </label>
        <input
          {...register('fullName')}
          type="text"
          id="fullName"
          className="w-full px-4 py-3 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
          placeholder="Jean Dupont"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
        )}
      </div>

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

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-cream-300 mb-2">
          Confirmer le mot de passe
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          className="w-full px-4 py-3 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Inscription...' : 'S\'inscrire'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
        >
          Déjà un compte ? Connectez-vous
        </button>
      </div>
    </form>
  );
};
