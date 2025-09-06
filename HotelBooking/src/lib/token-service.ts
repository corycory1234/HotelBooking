import { tokenCookieManager } from './cookie-utils';

export interface SecureTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  login_type: 'traditional' | 'google_oauth';
  created_at: number;
}

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  needsRefresh: boolean;
  tokenData?: SecureTokenData;
}

export class TokenService {
  private static instance: TokenService;
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Store token data securely in httpOnly cookie
   */
  public storeToken(tokenData: SecureTokenData): void {
    try {
      console.log('Storing token data in cookie:', tokenData);
      const tokenString = JSON.stringify(tokenData);
      tokenCookieManager.setCookie(tokenString);
      
      // Verify storage
      const stored = this.getToken();
      console.log('Token stored and verified:', stored);
      
      if (!stored) {
        throw new Error('Token was not properly stored in cookie');
      }
    } catch (error) {
      console.error('Failed to store token:', error);
      throw new Error('Token storage failed');
    }
  }

  /**
   * Retrieve token data from secure cookie
   */
  public getToken(): SecureTokenData | null {
    try {
      const tokenString = tokenCookieManager.getCookie();
      if (!tokenString) {
        return null;
      }

      return JSON.parse(tokenString) as SecureTokenData;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  /**
   * Clear stored token
   */
  public clearToken(): void {
    try {
      tokenCookieManager.deleteCookie();
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const tokenData = this.getToken();
    if (!tokenData) {
      return false;
    }

    const validation = this.validateToken(tokenData);
    return validation.isValid && !validation.isExpired;
  }

  /**
   * Validate token and check expiry status
   */
  public validateToken(tokenData?: SecureTokenData): TokenValidationResult {
    if (!tokenData) {
      tokenData = this.getToken();
    }

    if (!tokenData) {
      return {
        isValid: false,
        isExpired: true,
        needsRefresh: false
      };
    }

    const now = Date.now();
    const isExpired = now >= tokenData.expires_at;
    const needsRefresh = now >= (tokenData.expires_at - this.REFRESH_THRESHOLD);

    return {
      isValid: true,
      isExpired,
      needsRefresh: !isExpired && needsRefresh,
      tokenData
    };
  }

  /**
   * Create token data from traditional login response
   */
  public createTokenDataFromLogin(loginResponse: any): SecureTokenData {
    const now = Date.now();
    
    console.log('Creating token from login response:', loginResponse);
    
    // Handle different possible data structures
    const tokens = loginResponse.data?.tokens || loginResponse.tokens || loginResponse;
    const user = loginResponse.data?.user || loginResponse.user || {};
    
    const tokenData = {
      access_token: tokens.access_token || loginResponse.access_token,
      refresh_token: tokens.refresh_token || loginResponse.refresh_token || '',
      expires_at: tokens.expires_at || loginResponse.expires_at || (now + 24 * 60 * 60 * 1000), // Default 24h
      user_id: user.id || loginResponse.user_id || '',
      login_type: 'traditional' as const,
      created_at: now
    };
    
    console.log('Created token data:', tokenData);
    return tokenData;
  }

  /**
   * Create token data from Google OAuth response
   */
  public createTokenDataFromOAuth(oauthResponse: any): SecureTokenData {
    const now = Date.now();
    const expiresIn = oauthResponse.expires_in || 3600; // Default 1 hour
    
    console.log('Creating token from OAuth response:', oauthResponse);
    
    const tokenData = {
      access_token: oauthResponse.access_token,
      refresh_token: oauthResponse.refresh_token || '',
      expires_at: now + (expiresIn * 1000),
      user_id: oauthResponse.user?.id || oauthResponse.sub || '',
      login_type: 'google_oauth' as const,
      created_at: now
    };
    
    console.log('Created OAuth token data:', tokenData);
    return tokenData;
  }

  /**
   * Update token with refreshed data
   */
  public updateToken(updates: Partial<SecureTokenData>): boolean {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        return false;
      }

      const updatedToken: SecureTokenData = {
        ...currentToken,
        ...updates
      };

      this.storeToken(updatedToken);
      return true;
    } catch (error) {
      console.error('Failed to update token:', error);
      return false;
    }
  }

  /**
   * Get user ID from stored token
   */
  public getUserId(): string | null {
    const tokenData = this.getToken();
    return tokenData?.user_id || null;
  }

  /**
   * Get login type from stored token
   */
  public getLoginType(): 'traditional' | 'google_oauth' | null {
    const tokenData = this.getToken();
    return tokenData?.login_type || null;
  }

  /**
   * Get access token for API requests
   */
  public getAccessToken(): string | null {
    const tokenData = this.getToken();
    if (!tokenData) {
      return null;
    }

    const validation = this.validateToken(tokenData);
    if (validation.isExpired) {
      return null;
    }

    return tokenData.access_token;
  }

  /**
   * Check if token needs refresh
   */
  public needsRefresh(): boolean {
    const tokenData = this.getToken();
    if (!tokenData) {
      return false;
    }

    const validation = this.validateToken(tokenData);
    return validation.needsRefresh && !validation.isExpired;
  }

  /**
   * Get token expiry information
   */
  public getTokenExpiry(): { expiresAt: number; timeUntilExpiry: number } | null {
    const tokenData = this.getToken();
    if (!tokenData) {
      return null;
    }

    return {
      expiresAt: tokenData.expires_at,
      timeUntilExpiry: tokenData.expires_at - Date.now()
    };
  }
}

// Export singleton instance
export const tokenService = TokenService.getInstance();