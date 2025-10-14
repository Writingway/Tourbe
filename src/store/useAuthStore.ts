import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/database.types';
import { supabase } from '../lib/supabase';
import { getProfile } from '../lib/auth';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      isInitialized: false,

      setUser: (user) => set({ user }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Récupérer la session courante
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            set({ user: session.user });

            // Récupérer le profil
            try {
              const profile = await getProfile(session.user.id);
              set({ profile });
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }

          // Écouter les changements d'authentification
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);

            if (session?.user) {
              set({ user: session.user });

              // Récupérer le profil lors de la connexion
              if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                try {
                  const profile = await getProfile(session.user.id);
                  set({ profile });
                } catch (error) {
                  console.error('Error fetching profile:', error);
                }
              }
            } else {
              set({ user: null, profile: null });
            }
          });

          set({ isInitialized: true });
        } catch (error) {
          console.error('Error initializing auth:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const profile = await getProfile(user.id);
          set({ profile });
        } catch (error) {
          console.error('Error refreshing profile:', error);
        }
      },

      clear: () => {
        set({ user: null, profile: null, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Ne persister que les infos essentielles
        user: state.user,
        profile: state.profile,
      }),
    }
  )
);
