import { authAPI } from './auth-api';
import { createClient } from './supabase/client';
import { tokenService } from './token-service';

/**
 * Comprehensive logout function that clears all authentication state.
 * Google OAuth sessions live in an httpOnly cookie now, so `signOut()`
 * clears it server-side - no manual localStorage token scrubbing needed
 * for anything written going forward. We still do a one-time hygiene
 * sweep of legacy `sb-*-auth-token` keys left over from before this
 * migration, in case a returning user's browser still has one.
 */
export const logout = async (): Promise<void> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Supabase signOut failed:', error);
    }

    // Call backend logout endpoint and clear traditional-login cookie tokens
    await authAPI.logout();

    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('sb-') && key.includes('auth'))
        .forEach((key) => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Logout failed:', error);

    // Even if logout fails, clear local tokens
    tokenService.clearToken();
    throw error;
  }
};

/**
 * Force logout without API calls (for emergency cleanup)
 */
export const forceLogout = (): void => {
  try {
    // Clear secure tokens
    tokenService.clearToken();

    // Clear Supabase session
    createClient().auth.signOut().catch(() => {
      // Ignore errors in force logout
    });

    // Clear client storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    console.log('Force logout completed');
  } catch (error) {
    console.error('Force logout failed:', error);
  }
};
