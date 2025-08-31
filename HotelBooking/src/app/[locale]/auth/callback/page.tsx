'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase_Client';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { update_Access_Token } from '@/store/access_Token/access_Token_Slice';
import { update_Verify_Session } from '@/store/auth/isAuthenticated_Slice';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 從 URL 取得授權碼
        const code = searchParams.get('code');
        const redirect = searchParams.get('redirect') || '/';

        if (!code) {
          throw new Error('未收到授權碼');
        }

        // 呼叫後端 Google OAuth API
        const login_Url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google-login`;
        
        const api_Response = await fetch(login_Url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code }),
        });

        const data = await api_Response.json();

        if (!api_Response.ok) {
          throw new Error(data.message || 'Google 登入失敗');
        }

        // 儲存使用者資料到 Redux
        dispatch(update_Access_Token(data));
        dispatch(update_Verify_Session({
          success: true,
          data: {
            user: data.data.user
          }
        }));

        toast.success('Google 登入成功！', { duration: 3000 });
        
        // 重導向到指定頁面
        setTimeout(() => {
          router.push(decodeURIComponent(redirect));
        }, 1000);

      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Google 登入處理失敗');
        toast.error(error.message || 'Google 登入失敗');
        
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      } finally {
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