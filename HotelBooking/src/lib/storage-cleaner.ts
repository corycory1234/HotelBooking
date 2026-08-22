/**
 * One-time hygiene sweep for legacy localStorage-based auth data.
 *
 * Since the migration to @supabase/ssr, Google OAuth sessions live only in
 * an httpOnly cookie and nothing writes tokens to localStorage anymore.
 * This only cleans up residual keys that may still exist in a returning
 * user's browser from before the migration.
 */
export const cleanSensitiveStorageData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('sb-') && key.endsWith('-auth-token'))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clean localStorage:', error);
  }
};
