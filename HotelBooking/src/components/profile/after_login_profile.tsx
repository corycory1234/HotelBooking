'use client';

import { ProfileSVG } from "../client_Svg/client_Svg";
import { OtherSVG } from "../client_Svg/client_Svg";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";

const language_List = ["zh-TW", "en-US"];

export default function After_Login_Profile () {
  // 0.
  const router = useRouter();

  // 1. 多國語系切換 - 如果是 zh-TW, 就吃zh-TW; 若不是, 一率吃en-US
  const [language, set_Language] = useState<string>(language_List.includes(navigator.language) ? navigator.language : "en-US")
  const switch_Language = (new_Language: string) => {
    set_Language(new_Language)
  }

  useEffect(() => {
    console.log("uesEffect監聽多語系", language);
  },[language])

  // 2. loading 布林值
  const [loading_Boolean, set_Loading_Boolean] = useState<boolean>(false);

  // 3. 登出
  const log_Out = async () => {
    console.log('🔴 Log Out button clicked!'); // 確認按鈕被點擊
    
    try {
      set_Loading_Boolean(true); // loading動畫開始
      
      console.log('🚪 Starting logout process...');
      
      // 額外檢查localStorage中的token
      console.log('🔍 Current localStorage keys:', Object.keys(localStorage));
      const supabaseKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || key.includes('auth') || key.includes('supabase')
      );
      console.log('🔍 Supabase-related keys before logout:', supabaseKeys);
      
      // 使用統一的登出函數，會正確清除所有token
      await logout();
      
      console.log('✅ Logout function completed');
      
      toast.success("Log Out Successfully");
      router.push("/");

    } catch (error) {
      console.error("登出錯誤:", error);
      toast.error("登出失敗，請重試");
    } finally {
      set_Loading_Boolean(false); // loading動畫結束
    }
  }
  
  return <div className="pb-20">
  {/** 登出 */}
    <div className="bg-primary flex justify-center items-center gap-8 py-8">
      <div className="rounded-full bg-softGray p-2">
        <ProfileSVG name={"user"} className="w-10 h-auto"></ProfileSVG>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-white">Welcome</p>
        <p className="text-white">$ User</p>
      </div>

      {loading_Boolean === false ? 
        <button type="button" className="bg-green-700 text-white rounded p-2"
          onClick={log_Out}>Log Out
        </button>
        : 
        <button type="button" className="bg-softGray flex justify-center items-center rounded-lg p-3 gap-2" disabled>
          <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            Processing...
        </button>
      }

    </div>
  {/** 登出 */}


  <div className="customized-bg-gradient flex flex-col gap-4 p-4">

    {/** 多國語系切換 */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfileSVG name={"language"} className="w-5 h-auto" ></ProfileSVG>
        <p>Languages</p>
      </div>
      <select name="language" id="language" value={language} className="border rounded px-1 py-1" 
        onChange={(event) => switch_Language(event.target.value)}>
        <option value="zh-TW">繁體中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
    {/** 多國語系切換 */}

    <div className="border-b-2 border-softGray"></div>
    
    {/** 個人資料 */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfileSVG name={"user"} className="w-5 h-auto"></ProfileSVG>
        <p>Personal Details</p>
      </div>
      <p>{">"}</p>
    </div>
    {/** 個人資料 */}
    
    <div className="border-b-2 border-softGray"></div>

    {/** 我的最愛  */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfileSVG name={"collection"} className="w-5 h-auto"></ProfileSVG>
        <p>My Collection</p>
      </div>
      <p>{">"}</p>
    </div>
    {/** 我的最愛  */}

    <div className="border-b-2 border-softGray"></div>

    {/** 我的評論  */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfileSVG name={"review"} className="w-5 h-auto"></ProfileSVG>
        <p>My Reviews</p>
      </div>
      <p>{">"}</p>
    </div>
    {/** 我的評論  */}

    <div className="border-b-2 border-softGray"></div>

    {/** 關於我們  */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfileSVG name={"subscribe"} className="w-5 h-auto"></ProfileSVG>
        <p>Subscribe</p>
      </div>
      <p>{">"}</p>
    </div>
    {/** 關於我們  */}



    <div className="border-b-2 border-softGray"></div>

    {/** 關於我們  */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfileSVG name={"about"} className="w-5 h-auto"></ProfileSVG>
        <p>About Go Tour</p>
      </div>
      <p>{">"}</p>
    </div>
    {/** 關於我們  */}



  </div>
  
  </div>
}