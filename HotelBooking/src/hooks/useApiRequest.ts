import { useAuthState } from './useAuthState';
import toast from 'react-hot-toast';

export const useApiRequest = () => {
  const { accessToken, isAuthenticated } = useAuthState();

  /**
   * Make authenticated API request with automatic token handling
   */
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // Check if authenticated
    if (!isAuthenticated || !accessToken) {
      toast.error("Please Login First", { icon: "⚠️", duration: 2000 });
      throw new Error('Not authenticated');
    }

    // Add authorization header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${accessToken}`,
      ...options.headers,
    };

    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include'
    };

    console.log('Making authenticated request to:', url, {
      hasToken: !!accessToken,
      tokenSource: accessToken === accessToken ? 'unified' : 'unknown'
    });

    return fetch(url, requestOptions);
  };

  /**
   * Check if user is authenticated (useful for conditional UI)
   */
  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      toast.error("Please Login First", { icon: "⚠️", duration: 2000 });
      return false;
    }
    return true;
  };

  return {
    makeAuthenticatedRequest,
    requireAuth,
    isAuthenticated,
    accessToken
  };
};