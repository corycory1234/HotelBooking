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
        const redirect = searchParams.get('redirect') || '/';

        // 使用 Supabase 處理 OAuth 回調
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw new Error(error.message || 'Google 登入失敗');
        }

        if (!data.session) {
          throw new Error('未找到登入會話');
        }

        // 取得使用者資料
        const user = data.session.user;
        
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
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_at: data.session.expires_at
            }
          }
        };

        dispatch(update_Access_Token(userData));
        dispatch(update_Verify_Session({
          success: true,
          data: {
            user: userData.data.user
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