"use client";

import { supabase } from "@/lib/supabase_Client";
import { useSearchParams } from "next/navigation";

export default function Google_Login () {
  // 2.1 searchParams 專門拿 URL上的 「？後面的搜尋參數」; 沒有搜尋參數, 就是返回首頁
  const searchParams = useSearchParams();
  const redirect_Url = searchParams.get("redirect") || "/";


  // 11.
  const google_Login = async () => {
    console.log("Google Auth2.0");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect_Url
      }
    })
  };
  

return <>
  <button className="bg-white rounded-lg py-3 px-6 lg:shadow-lg" type="button"
    onClick={google_Login}>
    <img src="/account/Google.svg" alt="" />
  </button>
</>

}