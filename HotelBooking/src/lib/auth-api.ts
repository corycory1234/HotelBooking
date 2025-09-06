import { tokenService } from './token-service';
import { RefreshTokenResponse, AuthError } from '@/types/auth';

export class AuthAPI {
  private static instance: AuthAPI;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  public static getInstance(): AuthAPI {
    if (!AuthAPI.instance) {
      AuthAPI.instance = new AuthAPI();
    }
    return AuthAPI.instance;
  }

  /**
   * Refresh access token using refresh token
   */
  public async refreshToken(): Promise<RefreshTokenResponse | null> {
    try {
      const tokenData = tokenService.getToken();
      if (!tokenData?.refresh_token) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: tokenData.refresh_token
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Token refresh failed`);
      }

      const refreshData: RefreshTokenResponse = await response.json();
      
      // Update stored token with new data
      const success = tokenService.updateToken({
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token || tokenData.refresh_token,
        expires_at: refreshData.expires_at
      });

      if (!success) {
        throw new Error('Failed to update token storage');
      }

      return refreshData;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails, clear invalid tokens
      tokenService.clearToken();
      
      return null;
    }
  }

  /**
   * Check if current token is valid and refresh if needed
   */
  public async ensureValidToken(): Promise<boolean> {
    try {
      const tokenData = tokenService.getToken();
      if (!tokenData) {
        return false;
      }

      const validation = tokenService.validateToken(tokenData);
      
      // If token is expired, try to refresh
      if (validation.isExpired) {
        const refreshResult = await this.refreshToken();
        return refreshResult !== null;
      }

      // If token needs refresh (but not expired), refresh it
      if (validation.needsRefresh) {
        await this.refreshToken();
        // Even if refresh fails, current token is still valid
        return true;
      }

      // Token is valid and doesn't need refresh
      return validation.isValid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  public async authenticatedFetch(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    // Ensure we have a valid token
    const hasValidToken = await this.ensureValidToken();
    if (!hasValidToken) {
      throw new Error('No valid authentication token');
    }

    // Get current token
    const token = tokenService.getAccessToken();
    if (!token) {
      throw new Error('Failed to retrieve access token');
    }

    // Make request with token
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      credentials: 'include'
    };

    const response = await fetch(url, requestOptions);

    // If unauthorized, try to refresh token once and retry
    if (response.status === 401) {
      const refreshResult = await this.refreshToken();
      if (refreshResult) {
        const newToken = tokenService.getAccessToken();
        if (newToken) {
          const retryOptions: RequestInit = {
            ...requestOptions,
            headers: {
              ...requestOptions.headers,
              'Authorization': `Bearer ${newToken}`
            }
          };
          return await fetch(url, retryOptions);
        }
      }
    }

    return response;
  }

  /**
   * Logout user and clear all tokens
   */
  public async logout(): Promise<void> {
    try {
      const token = tokenService.getAccessToken();
      if (token) {
        // Call logout endpoint if available
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        }).catch(() => {
          // Ignore logout endpoint errors
        });
      }
    } finally {
      // Always clear local tokens
      tokenService.clearToken();
    }
  }
}

// Export singleton instance
export const authAPI = AuthAPI.getInstance();