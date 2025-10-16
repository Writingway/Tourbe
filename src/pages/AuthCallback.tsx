import { FC, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const AuthCallback: FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Récupérer la session depuis l'URL après OAuth
        const { data, error: authError } = await supabase.auth.getSession();

        if (authError) {
          console.error('Auth callback error:', authError);
          setError(authError.message);
          return;
        }

        if (data.session) {
          // Vérifier si le profil existe, sinon le créer (pour OAuth)
          const { error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          // Si le profil n'existe pas, le créer
          if (profileError && profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email!,
                full_name: data.session.user.user_metadata.full_name ||
                          data.session.user.user_metadata.name ||
                          'Utilisateur',
                role: 'user',
              } as never);

            if (insertError) {
              console.error('Error creating profile:', insertError);
            }
          }

          // Rediriger vers la page d'accueil
          window.location.href = '/';
        } else {
          // Pas de session, rediriger vers l'accueil
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError((err as Error).message);
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen textured-bg flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-serif font-bold text-gradient mb-4">
            Erreur d'authentification
          </h2>
          <p className="text-cream-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary w-full"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen textured-bg flex items-center justify-center">
      <div className="card p-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cream-300">Authentification en cours...</p>
        </div>
      </div>
    </div>
  );
};
