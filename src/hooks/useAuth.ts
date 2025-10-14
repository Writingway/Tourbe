import { useAuthStore } from '../store/useAuthStore';
import { signIn, signUp, signOut, signInWithGoogle } from '../lib/auth';
import type { SignInData, SignUpData } from '../lib/auth';

export function useAuth() {
  const { user, profile, isLoading, isInitialized, clear, refreshProfile } = useAuthStore();

  const isAuthenticated = !!user;
  const isAdmin = profile?.role === 'admin';

  const handleSignUp = async (data: SignUpData) => {
    await signUp(data);
    await refreshProfile();
  };

  const handleSignIn = async (data: SignInData) => {
    await signIn(data);
    await refreshProfile();
  };

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
    clear();
  };

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated,
    isAdmin,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    refreshProfile,
  };
}
