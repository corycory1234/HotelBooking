'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase_Client';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { update_Access_Token } from '@/store/access_Token/access_Token_Slice';
import { update_Verify_Session } from '@/store/auth/isAuthenticated_Slice';
// Note: Google OAuth tokens are managed by Supabase in localStorage
// Traditional login tokens use cookies via token-service

// 立即執行的log - 確保頁面被加載
console.log('🚨 AuthCallback PAGE LOADED - IMMEDIATE LOG');
console.log('🚨 Current URL:', typeof window !== 'undefined' ? window.location.href : 'server side');
console.log('🚨 Timestamp:', new Date().toISOString());

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 立即在組件加載時顯示一個指示器
  console.log('🎯 AuthCallback component loaded!');
  console.log('🎯 Component mounted at:', new Date().toISOString());

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const redirect = searchParams.get('redirect') || '/';

        console.log('🚀 OAuth callback started at:', new Date().toISOString());
        console.log('🔍 Full URL:', window.location.href);
        console.log('🔍 URL hash:', window.location.hash);
        console.log('🔍 URL search:', window.location.search);
        console.log('🔍 Pathname:', window.location.pathname);
        console.log('🔍 Redirect param:', redirect);
        
        // 檢查我們是否在正確的callback URL
        const expectedCallbackPath = window.location.pathname;
        console.log('🔍 Expected callback path:', expectedCallbackPath);
        
        // 立即檢查現有的localStorage狀態
        const existingSupabaseKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') && key.includes('auth')
        );
        console.log('🔍 Existing Supabase localStorage keys:', existingSupabaseKeys);
        
        // 如果沒有hash但有code參數，可能是authorization code flow
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        console.log('🔍 Auth code:', authCode ? 'Present' : 'None');
        
        // 處理 Supabase OAuth callback (支援 code 和 hash flow)
        if (authCode) {
          console.log('🔗 Processing OAuth authorization code...');
          // 這是 authorization code flow，讓 Supabase 自動處理
          const { data: codeData, error: codeError } = await supabase.auth.getSession();
          console.log('📋 Code flow session:', { 
            hasSession: !!codeData.session, 
            error: codeError?.message 
          });
        }
        
        // 優先讓 Supabase 自動處理 OAuth callback
        console.log('🔗 Let Supabase handle OAuth callback automatically...');
        
        // 首先嘗試讓 Supabase 自動處理 callback
        const { data: callbackData, error: callbackError } = await supabase.auth.getSession();
        
        console.log('📋 Initial session check:', { 
          hasSession: !!callbackData.session, 
          error: callbackError?.message 
        });
        
        // 如果自動處理失敗且URL中有hash，手動處理
        if (!callbackData.session && window.location.hash) {
          console.log('🔧 Fallback: manually processing hash fragment...');
          
          // 解析 hash 參數
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const expiresAt = hashParams.get('expires_at');
          
          console.log('📋 Hash tokens:', { 
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            expiresAt,
            tokenLength: accessToken?.length 
          });
          
          // 如果 hash 中有 token，手動設置 session
          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (sessionError) {
              console.error('Failed to set session:', sessionError);
              throw new Error('Failed to set session: ' + sessionError.message);
            } else {
              console.log('✅ Session set successfully from hash');
            }
          }
        }
        
        // 清理URL hash (立即清理)
        if (window.location.hash) {
          const cleanUrl = window.location.pathname + window.location.search;
          window.history.replaceState({}, document.title, cleanUrl);
          console.log('🧹 Cleaned URL hash, new URL:', cleanUrl);
        }
        
        // 設置 auth state change 監聽器
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('🔔 Auth state change:', { event, hasSession: !!session });
          if (event === 'SIGNED_IN' && session) {
            console.log('✅ Auth listener detected sign in with session');
          }
        });
        
        // 獲取最終session
        const { data: finalData, error: finalError } = await supabase.auth.getSession();
        
        if (finalError) {
          console.error('Final session error:', finalError);
          throw new Error(finalError.message || 'Google 登入失敗');
        }
        
        if (!finalData.session || !finalData.session.access_token) {
          console.error('No session found after processing');
          throw new Error('未找到登入會話，請重試');
        }
        
        const session = finalData.session;
        console.log('✅ Final session confirmed:', { 
          hasSession: true, 
          hasToken: true,
          tokenLength: session.access_token.length
        });

        // 取得使用者資料
        const user = session.user;
        
        // 簡單確認localStorage中已有token
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const supabaseStorageKey = Object.keys(localStorage).find(key => 
          key.startsWith('sb-') && key.endsWith('-auth-token')
        );
        
        console.log('🔑 localStorage token verification:', { 
          hasLocalStorageKey: !!supabaseStorageKey,
          keyName: supabaseStorageKey 
        });
        
        // 儲存到 Redux
        const userData = {
          success: true,
          data: {
            user: {
              id: user.id,
              name: user.user_metadata?.full_name || user.email || '',
              email: user.email || '',
              userType: 'google',
              createdAt: user.created_at || '',
              updatedAt: user.updated_at || ''
            },
            tokens: {
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at
            }
          }
        };

        // Store user data in Redux (without tokens - let Supabase manage tokens in localStorage)
        console.log('📱 Using Supabase localStorage for token management');
        
        dispatch(update_Access_Token(userData));
        dispatch(update_Verify_Session({
          success: true,
          data: {
            user: userData.data.user
          }
        }));

        console.log('🎉 About to show success toast...');
        toast.success('Google 登入成功！', { duration: 3000 });
        console.log('✅ Toast should be visible now');
        
        // 確保重導向URL是乾淨的（沒有hash fragment）
        let cleanRedirectUrl = decodeURIComponent(redirect);
        // 移除可能存在的hash fragment
        if (cleanRedirectUrl.includes('#')) {
          cleanRedirectUrl = cleanRedirectUrl.split('#')[0];
        }
        console.log('🔄 Redirecting to clean URL:', cleanRedirectUrl);
        
        // 重導向到指定頁面
        setTimeout(() => {
          // 使用 replace 而不是 push，避免在瀏覽器歷史中保留callback頁面
          router.replace(cleanRedirectUrl);
        }, 1000);
        
        // 清理監聽器
        if (authListener?.subscription) {
          authListener.subscription.unsubscribe();
        }

      } catch (error: any) {
        console.error('🚨 Auth callback error details:', {
          error,
          message: error?.message,
          stack: error?.stack,
          url: window.location.href
        });
        
        const errorMessage = error.message || 'Google 登入處理失敗';
        setError(errorMessage);
        
        console.log('🚨 About to show error toast:', errorMessage);
        toast.error(errorMessage);
        
        setTimeout(() => {
          console.log('🔄 Redirecting to /auth due to error');
          router.push('/auth');
        }, 3000);
      } finally {
        console.log('🏁 AuthCallback finally block - setting loading to false');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, router, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">正在處理 Google 登入...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">登入失敗</h2>
          <p>{error}</p>
          <p className="mt-4 text-gray-600">即將返回登入頁面...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-green-500 text-center">
        <h2 className="text-xl font-semibold mb-2">登入成功！</h2>
        <p className="text-gray-600">即將跳轉...</p>
      </div>
    </div>
  );
}