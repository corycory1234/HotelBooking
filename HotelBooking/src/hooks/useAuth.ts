import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tokenService } from '@/lib/token-service';
import { AuthUser, SessionInfo, AuthState } from '@/types/auth';
import { RootState } from '@/store/store';

export interface UseAuthReturn {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  
  // Session information
  sessionInfo: SessionInfo | null;
  
  // Token management
  hasValidToken: boolean;
  tokenNeedsRefresh: boolean;
  
  // Methods
  checkAuthStatus: () => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();
  
  // Get user info from Redux (non-sensitive data)
  const reduxUser = useSelector((state: RootState) => state.verify_Session);
  
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [hasValidToken, setHasValidToken] = useState(false);
  const [tokenNeedsRefresh, setTokenNeedsRefresh] = useState(false);

  /**
   * Check current authentication status
   */
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const isAuth = tokenService.isAuthenticated();
      const tokenData = tokenService.getToken();
      
      setHasValidToken(isAuth);
      
      if (tokenData) {
        const validation = tokenService.validateToken(tokenData);
        setTokenNeedsRefresh(validation.needsRefresh);
        
        // Update session info
        setSessionInfo({
          isValid: validation.isValid && !validation.isExpired,
          expiresAt: tokenData.expires_at,
          userId: tokenData.user_id,
          loginType: tokenData.login_type,
          timeUntilExpiry: tokenData.expires_at - Date.now()
        });
      } else {
        setSessionInfo(null);
        setTokenNeedsRefresh(false);
      }
      
      return isAuth;
    } catch (error) {
      console.error('Auth status check failed:', error);
      setHasValidToken(false);
      setTokenNeedsRefresh(false);
      setSessionInfo(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user and clear all tokens
   */
  const logout = useCallback(() => {
    try {
      // Clear secure token
      tokenService.clearToken();
      
      // Clear Redux state (optional - could dispatch logout action)
      // dispatch(authActions.logout());
      
      // Reset local state
      setHasValidToken(false);
      setTokenNeedsRefresh(false);
      setSessionInfo(null);
      
      // Redirect to login page (optional)
      // window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  /**
   * Refresh session token
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const tokenData = tokenService.getToken();
      if (!tokenData?.refresh_token) {
        return false;
      }

      // TODO: Implement actual refresh API call
      // For now, just extend current token (placeholder)
      const newExpiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      
      const success = tokenService.updateToken({
        expires_at: newExpiresAt
      });

      if (success) {
        await checkAuthStatus();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [checkAuthStatus]);

  // Check auth status on component mount and when dependencies change
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (tokenNeedsRefresh && hasValidToken) {
      refreshSession();
    }
  }, [tokenNeedsRefresh, hasValidToken, refreshSession]);

  // Create user object from Redux and token data
  const user: AuthUser | null = useMemo(() => {
    if (!hasValidToken || !reduxUser.userInfo) {
      return null;
    }

    const loginType = tokenService.getLoginType();
    
    return {
      id: reduxUser.userInfo.id || '',
      email: reduxUser.userInfo.email || '',
      name: reduxUser.userInfo.name || '',
      avatar_url: reduxUser.userInfo.avatar_url,
      login_type: loginType || 'traditional'
    };
  }, [hasValidToken, reduxUser, tokenService]);

  return {
    // Authentication state
    isAuthenticated: hasValidToken && !!user,
    isLoading,
    user,
    
    // Session information
    sessionInfo,
    
    // Token management
    hasValidToken,
    tokenNeedsRefresh,
    
    // Methods
    checkAuthStatus,
    logout,
    refreshSession
  };
};