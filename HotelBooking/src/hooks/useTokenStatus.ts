import { useState, useEffect, useCallback } from 'react';
import { tokenService } from '@/lib/token-service';
import { authAPI } from '@/lib/auth-api';
import { TokenValidationResult } from '@/types/auth';

export interface UseTokenStatusReturn {
  isTokenValid: boolean;
  isTokenExpired: boolean;
  needsRefresh: boolean;
  isLoading: boolean;
  checkTokenStatus: () => TokenValidationResult;
  refreshToken: () => Promise<boolean>;
}

/**
 * Hook for checking token status and validation
 * This hook focuses solely on token management without UI state
 */
export const useTokenStatus = (): UseTokenStatusReturn => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(true);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check current token status
   */
  const checkTokenStatus = useCallback((): TokenValidationResult => {
    const validation = tokenService.validateToken();
    
    setIsTokenValid(validation.isValid);
    setIsTokenExpired(validation.isExpired);
    setNeedsRefresh(validation.needsRefresh);
    
    return validation;
  }, []);

  /**
   * Refresh token using AuthAPI
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const refreshResult = await authAPI.refreshToken();
      
      if (refreshResult) {
        checkTokenStatus();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkTokenStatus]);

  /**
   * Initial token check and setup periodic validation
   */
  useEffect(() => {
    setIsLoading(true);
    checkTokenStatus();
    setIsLoading(false);

    // Check token status every minute
    const interval = setInterval(() => {
      checkTokenStatus();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [checkTokenStatus]);

  /**
   * Auto-refresh when token needs refresh
   */
  useEffect(() => {
    if (needsRefresh && isTokenValid && !isTokenExpired) {
      refreshToken();
    }
  }, [needsRefresh, isTokenValid, isTokenExpired, refreshToken]);

  return {
    isTokenValid,
    isTokenExpired,
    needsRefresh,
    isLoading,
    checkTokenStatus,
    refreshToken
  };
};