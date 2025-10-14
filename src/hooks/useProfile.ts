import { useState } from 'react';
import { updateProfile, deleteAccount } from '../lib/auth';
import { useAuthStore } from '../store/useAuthStore';
import type { ProfileUpdate } from '../lib/database.types';

export function useProfile() {
  const { user, profile, refreshProfile } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = async (updates: ProfileUpdate) => {
    if (!user) throw new Error('User not authenticated');

    setIsUpdating(true);
    try {
      await updateProfile(user.id, updates);
      await refreshProfile();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) throw new Error('User not authenticated');

    setIsDeleting(true);
    try {
      await deleteAccount(user.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    profile,
    isUpdating,
    isDeleting,
    updateProfile: handleUpdateProfile,
    deleteAccount: handleDeleteAccount,
  };
}
