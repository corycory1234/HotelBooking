import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { tokenService } from '@/lib/token-service';
import { supabase } from '@/lib/supabase_Client';

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userType: string | null;
  loading: boolean;
}

/**
 * Hook that combines Cookie token with Redux user info for authentication state
 */
export const useAuthState = (): AuthState => {
  const [loading, setLoading] = useState(true);
  const [cookieToken, setCookieToken] = useState<string | null>(null);
  const [supabaseToken, setSupabaseToken] = useState<string | null>(null);

  // Get user info from Redux (non-sensitive data)
  const reduxUser = useSelector((state: RootState) => state.access_Token.data?.user);
  const reduxToken = useSelector((state: RootState) => state.access_Token.data?.tokens?.access_token);

  // Check all token sources
  useEffect(() => {
    const checkAllTokens = async () => {
      try {
        // Check cookie token
        const cookieAccessToken = tokenService.getAccessToken();
        setCookieToken(cookieAccessToken);
        console.log('Cookie token check:', cookieAccessToken ? 'Found' : 'Not found');

        // Check Supabase session token
        const { data: { session } } = await supabase.auth.getSession();
        let supabaseAccessToken = session?.access_token || null;
        
        // If no session, try to get from localStorage directly (fallback)
        if (!supabaseAccessToken) {
          try {
            const supabaseStorageKey = Object.keys(localStorage).find(key => 
              key.startsWith('sb-') && key.endsWith('-auth-token')
            );
            if (supabaseStorageKey) {
              const storedAuth = localStorage.getItem(supabaseStorageKey);
              if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth);
                supabaseAccessToken = parsedAuth.access_token;
                console.log('Found Supabase token in localStorage:', supabaseStorageKey);
              }
            }
          } catch (error) {
            console.error('Error reading Supabase localStorage:', error);
          }
        }
        
        setSupabaseToken(supabaseAccessToken);
        console.log('Supabase token check:', supabaseAccessToken ? 'Found' : 'Not found');
        console.log('Supabase session details:', {
          hasSession: !!session,
          hasAccessToken: !!session?.access_token,
          hasDirectToken: !!supabaseAccessToken,
          tokenLength: supabaseAccessToken?.length,
          expiresAt: session?.expires_at
        });
        
      } catch (error) {
        console.error('Failed to check tokens:', error);
        setCookieToken(null);
        setSupabaseToken(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkAllTokens();

    // Check every 5 seconds for token changes during first minute, then every 30 seconds
    const interval = setInterval(checkAllTokens, 5000);
    
    // After 60 seconds, change to longer interval
    const longInterval = setTimeout(() => {
      clearInterval(interval);
      setInterval(checkAllTokens, 30000);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(longInterval);
    };
  }, []);

  // Determine authentication status (prioritize: supabase > redux > cookie)  
  // Note: Reverted priority since we're no longer using cookies for traditional login
  const isAuthenticated = !!(supabaseToken || reduxToken || cookieToken);
  const finalAccessToken = supabaseToken || reduxToken || cookieToken || null;
  const userType = reduxUser?.userType || null;
  
  // Check if user is authenticated via Google (Supabase OAuth)
  const isGoogleUser = !!supabaseToken;

  console.log('🔐 Auth state (useAuthState):', { 
    isAuthenticated, 
    hasCookieToken: !!cookieToken,
    hasSupabaseToken: !!supabaseToken,
    hasReduxToken: !!reduxToken,
    isGoogleUser,
    usingToken: finalAccessToken ? `${finalAccessToken.substring(0, 20)}...` : null,
    userType,
    loading 
  });

  return {
    isAuthenticated,
    accessToken: finalAccessToken,
    userType,
    loading
  };
};