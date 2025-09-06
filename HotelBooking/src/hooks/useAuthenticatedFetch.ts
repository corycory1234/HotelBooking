import { useCallback } from 'react';
import { authAPI } from '@/lib/auth-api';
import { logout } from '@/lib/logout';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface UseAuthenticatedFetchReturn {
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
  logout: () => Promise<void>;
}

/**
 * Hook for making authenticated API requests with automatic token management
 */
export const useAuthenticatedFetch = (): UseAuthenticatedFetchReturn => {
  const router = useRouter();

  /**
   * Make authenticated fetch request with automatic token refresh
   */
  const authenticatedFetch = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      const response = await authAPI.authenticatedFetch(url, options);
      
      // Handle common error cases
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - token might be invalid
          toast.error('登入已過期，請重新登入');
          await handleLogout();
          throw new Error('Authentication failed');
        } else if (response.status === 403) {
          // Forbidden - user doesn't have permission
          toast.error('權限不足');
          throw new Error('Permission denied');
        }
      }
      
      return response;
    } catch (error: any) {
      // Handle network errors
      if (error.message?.includes('Failed to fetch')) {
        toast.error('網路連線錯誤，請檢查您的網路連線');
        throw new Error('Network error');
      }
      
      // Handle token-related errors
      if (error.message?.includes('No valid authentication token')) {
        await handleLogout();
        throw error;
      }
      
      // Re-throw other errors
      throw error;
    }
  }, [router]);

  /**
   * Handle logout and redirect
   */
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/auth');
    }
  }, [router]);

  return {
    authenticatedFetch,
    logout: handleLogout
  };
};