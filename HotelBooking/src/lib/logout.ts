import { authAPI } from './auth-api';
import { supabase } from './supabase_Client';
import { tokenService } from './token-service';

/**
 * Comprehensive logout function that clears all authentication state
 */
export const logout = async (): Promise<void> => {
  try {
    const loginType = tokenService.getLoginType();
    
    // Handle different logout scenarios based on login type
    if (loginType === 'google_oauth') {
      // Sign out from Supabase for Google OAuth
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Supabase signOut failed:', error);
      }
    }
    
    // Call backend logout endpoint and clear cookie tokens
    await authAPI.logout();
    
    // Clear any client-side storage (if any)
    if (typeof window !== 'undefined') {
      // Clear localStorage items that might contain sensitive data
      const keysToRemove = [
        'persist:root', // Redux persist root
        'supabase.auth.token', // Supabase tokens
        'hotel_auth_token' // Our app tokens (if any leaked to client)
      ];
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to clear storage key ${key}:`, error);
        }
      });
    }
    
    console.log('Logout completed successfully');
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
    supabase.auth.signOut().catch(() => {
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