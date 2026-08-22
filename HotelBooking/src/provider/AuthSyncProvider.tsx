'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createClient } from '@/lib/supabase/client';
import { update_Access_Token } from '@/store/access_Token/access_Token_Slice';
import { update_Verify_Session } from '@/store/auth/isAuthenticated_Slice';

/**
 * Keeps Redux in sync with the Supabase session (httpOnly-cookie-backed).
 * Google OAuth no longer has a client-side moment to dispatch user info
 * right after login (the callback is a server redirect), so this runs on
 * every mount/auth-state-change instead - it only ever stores non-sensitive
 * profile fields, never the real access/refresh tokens.
 */
export default function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const supabase = createClient();

    const syncUser = (user: { id: string; email?: string; user_metadata?: any; created_at?: string; updated_at?: string } | null) => {
      if (!user) return;

      const userData = {
        id: user.id,
        name: user.user_metadata?.full_name || user.email || '',
        email: user.email || '',
        userType: 'google',
      };

      dispatch(update_Access_Token({
        success: true,
        data: {
          user: userData,
          // Google OAuth tokens live only in the httpOnly Supabase cookie.
          tokens: { access_token: '', refresh_token: '' },
        },
      }));

      dispatch(update_Verify_Session({
        success: true,
        data: {
          user: {
            ...userData,
            createdAt: user.created_at || '',
            updatedAt: user.updated_at || '',
          },
        },
      }));
    };

    supabase.auth.getUser().then(({ data: { user } }) => syncUser(user));

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        dispatch(update_Access_Token({
          success: false,
          data: {
            user: { id: '', name: '', userType: '', email: '' },
            tokens: { access_token: '', refresh_token: '' },
          },
        }));
        return;
      }
      syncUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}
