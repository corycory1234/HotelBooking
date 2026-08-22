import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { tokenService } from '@/lib/token-service';
import { createClient } from '@/lib/supabase/client';

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userType: string | null;
  loading: boolean;
  isGoogleUser: boolean;
}

/**
 * Hook that combines the Supabase session (httpOnly-cookie-backed, for
 * Google OAuth) with Redux user info (for traditional login) to derive
 * authentication state.
 *
 * Google OAuth sessions never expose a raw access token to client JS -
 * `accessToken` is only populated for traditional logins, whose token
 * still legitimately lives in Redux.
 */
export const useAuthState = (): AuthState => {
  const [loading, setLoading] = useState(true);
  const [hasSupabaseSession, setHasSupabaseSession] = useState(false);
  const [cookieToken, setCookieToken] = useState<string | null>(null);

  const reduxUser = useSelector((state: RootState) => state.access_Token.data?.user);
  const reduxToken = useSelector((state: RootState) => state.access_Token.data?.tokens?.access_token);

  useEffect(() => {
    const supabase = createClient();

    setCookieToken(tokenService.getAccessToken());

    supabase.auth.getUser().then(({ data: { user } }) => {
      setHasSupabaseSession(!!user);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSupabaseSession(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const isGoogleUser = hasSupabaseSession;
  const isAuthenticated = hasSupabaseSession || !!reduxToken || !!cookieToken;
  // Only traditional-login tokens are ever exposed client-side.
  const finalAccessToken = !isGoogleUser ? (reduxToken || cookieToken || null) : null;
  const userType = reduxUser?.userType || null;

  return {
    isAuthenticated,
    accessToken: finalAccessToken,
    userType,
    loading,
    isGoogleUser
  };
};
