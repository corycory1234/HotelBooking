import { useAuthState } from './useAuthState';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const useApiRequest = () => {
  const { accessToken, isAuthenticated, isGoogleUser } = useAuthState();

  /**
   * Make authenticated API request with automatic token handling.
   *
   * `url` may be an absolute backend URL (built from NEXT_PUBLIC_API_BASE_URL)
   * or a path relative to it - either way, the request is routed through the
   * server-side `/api/proxy` route. Traditional logins attach their real
   * token client-side (unchanged); Google OAuth logins carry no client-side
   * token at all - the proxy attaches the httpOnly-cookie-backed session
   * server-side instead.
   */
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // Check if authenticated
    if (!isAuthenticated) {
      toast.error("Please Login First", { icon: "⚠️", duration: 2000 });
      throw new Error('Not authenticated');
    }

    const backendPath = url.startsWith(API_BASE_URL)
      ? url.slice(API_BASE_URL.length)
      : url;
    const proxyUrl = `/api/proxy${backendPath.startsWith('/') ? backendPath : `/${backendPath}`}`;

    // Don't force a JSON content-type when the body is FormData - the
    // browser needs to set its own multipart boundary, and overriding it
    // would break file uploads.
    const headers: Record<string, string> = {
      ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };

    // Google OAuth users have no real client-side token - the proxy uses
    // the httpOnly session cookie instead, so no Authorization header here.
    if (!isGoogleUser && accessToken) {
      headers['Authorization'] = `bearer ${accessToken}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include'
    };

    return fetch(proxyUrl, requestOptions);
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
