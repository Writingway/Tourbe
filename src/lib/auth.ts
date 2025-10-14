import { supabase } from './supabase';
import type { ProfileInsert, ProfileUpdate } from './database.types';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function signUp({ email, password, fullName }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;

  // Créer le profil utilisateur
  if (data.user) {
    const profileData: ProfileInsert = {
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
      role: 'user',
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }
  }

  return data;
}

/**
 * Connexion d'un utilisateur
 */
export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Connexion avec Google
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Déconnexion
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Récupérer le profil utilisateur
 */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mettre à jour le profil utilisateur
 */
export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Supprimer le compte utilisateur
 */
export async function deleteAccount(userId: string) {
  // Supprimer le profil (cascade delete sur les quiz_results)
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) throw profileError;

  // Déconnecter l'utilisateur
  await signOut();
}

/**
 * Récupérer la session courante
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Vérifier si l'utilisateur est admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getProfile(userId);
  return profile.role === 'admin';
}
