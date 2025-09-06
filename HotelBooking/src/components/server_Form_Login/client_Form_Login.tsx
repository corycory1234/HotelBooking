'use client';
import React from 'react';
import Client_Input_Password from "./client_Input_Password";
import { Submit_Login } from "../../actions/login";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { sleep } from "@/utils/sleep";
import { OtherSVG } from "../client_Svg/client_Svg";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { update_Verify_Session } from "@/store/auth/isAuthenticated_Slice";
import { update_Access_Token } from "@/store/access_Token/access_Token_Slice";
// Note: Reverted to original Redux-based token storage approach
import { supabase } from "@/lib/supabase_Client";
import { useTranslations } from "next-intl";
// const initialState = { message: ""};


// 1. zod 校驗錯誤之訊息
const schema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string()
  .min(8, {message: "Must be 8 or more characters long"})
  .max(20, {message: "Must be 12 or fewer characters long"})
})

// 2. API返回 Zod 錯誤訊息 之 接口
interface zod_Response_Interface {
  success: boolean;
  emailError: string;
  passwordError: string;
}

export default function Server_Form_Login () {
  const router = useRouter()
  // 2. 沒有 token, 就跳回'/auth', 但記得要給「當下頁面的搜尋參數」, 好讓登入後, 返回「旅客填寫表單」
  // 2.1 searchParams 專門拿 URL上的 「？後面的搜尋參數」; 沒有搜尋參數, 就是返回首頁
  const searchParams = useSearchParams();
  const redirect_Url = searchParams.get("redirect") || "/";

  // Server Action 的狀態 與 函式
  // const [state, formAction] = useFormState(Submit_Login, initialState)
  
  // 3. 本地 <input> 的狀態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 4. 接 API返回之response 與 Zod錯誤訊息之response
  const [zod_Response, set_Zod_Response] = useState<zod_Response_Interface>(); // API返回 Zod錯誤訊息狀態

  // 5. 監聽 API返回 response 之數據
  const [response, set_Response] = useState();
  
  // 5.1 Redux - 令牌 (fallback, prefer cookie token)
  const redux_Access_Token = useSelector((state: RootState) => state.access_Token.data.tokens.access_token);

  // 6. loading 布林開關 
  const [loading_Boolean, set_Loading_Boolean] = useState(false);

  // 7. 登入表單提交
  const handle_Login = async (event: React.FormEvent) => {
    event.preventDefault();
    set_Loading_Boolean(true); // loading 開始動畫
    const login_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/login";

    try {
      // 8. Zod 驗證
      const validateFields = schema.safeParse({email, password});
        // 8.1 Zod 校驗之錯誤訊息
        if(!validateFields.success) {
          const { fieldErrors } = validateFields.error.flatten();
          return set_Zod_Response({ success: false,
            // 這邊 emailError 或 passwordError 都可能是陣列
            emailError: fieldErrors.email?.[0] || "", // 只取第一個錯誤訊息
            passwordError: fieldErrors.password?.[0] || ""
          })      
        };

      // 9. 開始串接 API接口
      const api_Response = await fetch(login_Url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
        credentials: 'include' // 同源政策 CORS 需要
      });

      const data = await api_Response.json();
      if(!api_Response.ok) {
        set_Response(data);
        toast.error("Login Failed")
      } else {
        toast.success("Login OK", {duration: 3000});
        set_Response(data);
        
        // Store token data directly in Redux (revert to original approach)
        console.log('📱 Using Redux/localStorage for traditional login');
        dispatch(update_Access_Token(data));
        
        await sleep(1500);
        
        // Verify token and get user info
        await verify_Token();
        await get_User_Info();
        
        router.push(redirect_Url);
      }
    } catch (error) {
      toast.error("Login Failed")
    } finally {
      set_Loading_Boolean(false);
    }
  }


  // 9. 驗證帳號是否有登入
  const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);
  const dispatch: AppDispatch = useDispatch();
  const verify_Token = async () => {
    const verify_session_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/verify-session";

    try {
      // Use Redux token
      const token = redux_Access_Token;
      
      if (!token) {
        console.warn('No token available for verification');
        return;
      }

      const response = await fetch(verify_session_Url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        },
        credentials: 'include' // 同源政策 CORS 需要
      });

      const data = await response.json();
      // console.log(data);
      dispatch(update_Verify_Session(data));
    } catch (error) {
      console.log(error);
    }
  }

  // 10. 取得個人數據
  const [user_Info, set_User_Info] = useState();
  const get_User_Info = async () => {
    try {
      // Use Redux token
      const token = redux_Access_Token;
      
      if (!token) {
        console.warn('No token available for user info');
        return;
      }

      const user_Info_Url =  process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/me";
      const response = await fetch(user_Info_Url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        },
        credentials: 'include' // 同源政策 CORS 需要
      });
      const data = await response.json();
      // console.log(data, "查看個人數據");
    } 
    catch (error) {
      console.log(error);
    }
  };

  // 11. Google 第三方登入
  const google_Login = async () => {
    console.log('🎯 Google login button clicked!'); // 基本測試日誌
    try {
      set_Loading_Boolean(true);
      
      // 獲取當前語言設定
      const currentLocale = window.location.pathname.split('/')[1] || 'zh-TW';
      
      // 修正重定向URL，確保不是空字符串或"."
      let finalRedirectUrl = redirect_Url;
      if (!finalRedirectUrl || finalRedirectUrl === '.' || finalRedirectUrl === '/') {
        finalRedirectUrl = `/${currentLocale}`;
      }
      
      // 開發環境使用production callback，確保遠端部署穩定
      const isDevelopment = window.location.origin.includes('localhost');
      const targetOrigin = isDevelopment 
        ? 'https://hotel-booking-delta-gray.vercel.app'  // 開發時也用production
        : window.location.origin;
      
      const callbackUrl = `${targetOrigin}/${currentLocale}/auth/callback?redirect=${encodeURIComponent(finalRedirectUrl)}`;
      
      console.log('🔗 Original redirect_Url:', redirect_Url);
      console.log('🔗 Final redirect URL:', finalRedirectUrl);
      console.log('🔗 Google OAuth callback URL:', callbackUrl);
      console.log('🔗 Current window origin:', window.location.origin);
      console.log('🔗 Current locale:', currentLocale);
      
      // 檢查是否是本地開發環境
      if (window.location.origin.includes('localhost')) {
        console.warn('⚠️ Using localhost - make sure Supabase has localhost:3000 in redirect URLs');
      }
      
      console.log('🚀 About to call supabase.auth.signInWithOAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      console.log('📋 OAuth response:', { data, error });

      if (error) {
        console.error('🚨 Google OAuth error details:', {
          error,
          message: error.message,
          code: error.status,
          details: error
        });
        toast.error(`Google 登入失敗: ${error.message}`);
      } else if (data?.url) {
        console.log('✅ OAuth call successful, got redirect URL');
        console.log('OAuth data:', data);
        console.log('🔄 Manually redirecting to:', data.url);
        
        // 嘗試多種重定向方式以確保兼容性
        try {
          // 方式1: 使用 window.location.assign (比較溫和)
          window.location.assign(data.url);
        } catch (e) {
          console.log('Method 1 failed, trying method 2...');
          try {
            // 方式2: 使用 window.location.href
            window.location.href = data.url;
          } catch (e2) {
            console.log('Method 2 failed, trying method 3...');
            // 方式3: 使用 window.open 並立即切換到該頁面
            const newWindow = window.open(data.url, '_self');
            if (!newWindow) {
              console.error('All redirect methods failed. Please check popup blocker.');
              toast.error('重定向失敗，請檢查彈窗阻擋設定');
            }
          }
        }
      } else {
        console.warn('⚠️ OAuth successful but no URL returned', data);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error("Google 登入失敗");
    } finally {
      set_Loading_Boolean(false);
    }
  };

  // 12. next-intl i18n-翻譯
  const t = useTranslations("Auth");


  return <div className="flex flex-col h-screen my-bg-gradient lg:bg-white lg:h-[70vh] lg:mx-auto lg:rounded lg:shadow-lg lg:py-4">
    <div className="relative">
      <img src="/Logo.svg" className="absolute left-[50%] -translate-x-1/2 w-20 h-20 -top-10" alt="" /> 
    </div>
      
    <div className=" flex flex-col mt-10">
      {/** 電子郵件 SVG */}
      <div className="relative">
        <img src="/account/Email.svg" alt="" className="absolute top-[3.45rem] left-8"/>
      </div>
      {/** 電子郵件 SVG */}

      <form onSubmit={handle_Login} className="flex flex-col px-4 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="email" className="text-gray">{t ("Enter Email")}</label>
        <input type="text" id="email" name="email" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"
          value={email} onChange={(event) => setEmail(event.target.value)}/>
        <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        <Client_Input_Password password={password} setPassword={setPassword}></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.passwordError}</p>
        {/* 密碼 */}
        
        {loading_Boolean ?
          <button type="button" className="bg-softGray flex justify-center items-center rounded-lg py-3 gap-2" disabled>
            <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            {t ("Processing") + "..."}
          </button>
          :
          <button className="bg-primary rounded-lg py-3 text-white">{t ("Sign In")}</button>
        }
      </form>
      
      <div className="pt-4 flex flex-col justify-center items-center gap-4 my-bg-gradient lg:bg-white lg:rounded py-2">
        <p className="text-gray">{t ("Don't have an account?")} <Link href={'/register'} className="text-primary font-semibold">{t ("Register")}</Link></p>
        <Link href={'/forgetpassword'} className="text-primary font-semibold">
          <p className="text-gray hover:border-b-2 border-gray">{t ("Forget Password?")}</p>
        </Link>
        <p className="text-center text-sm">{t ("Or Sign in With")}</p>
        <button 
          className="bg-white rounded-lg py-3 px-6 lg:shadow-lg flex justify-center items-center gap-2 hover:shadow-xl transition-shadow" 
          type="button"
          onClick={google_Login}
          disabled={loading_Boolean}
        >
          {loading_Boolean ? (
            <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
          ) : (
            <img src="/account/Google.svg" alt="" />
          )}
          {loading_Boolean ? "登入中..." : ""}
        </button>
      </div>
      
      
    </div>
  </div>
}