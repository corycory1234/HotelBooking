'use client';
import Link from "next/link";
import { useState } from "react";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sleep } from "@/utils/sleep";
import { z } from 'zod';
import { useTranslations } from "next-intl";

// 1. zod 校驗錯誤之訊息
const schema = z.object({
  email: z.string().email("Invalid Email")
});
// 2. zod 錯誤訊息之接口
interface zod_Response_Interface {
  success: boolean;
  emailError: string;
}

export default function Forget_Password() {
  const router = useRouter();

  // 3. 本地 <input> 的狀態
  const [email, setEmail] = useState("");
  const [zod_Response, set_Zod_Response] = useState<zod_Response_Interface>(); // API返回 Zod錯誤訊息狀態
  const [response, set_Response] = useState();

  // 4. loading 布林開關 
  const [loading_Boolean, set_Loading_Boolean] = useState(false);

  // 5. 忘記密碼表單提交
  const handle_Foget_Password = async (event: React.FormEvent) => {
    event.preventDefault(); // 阻止瀏覽器默認提交

    // 6 zod 校驗, 並 更新錯誤訊息
    const validateFields = schema.safeParse({email});
    if(!validateFields.success) {
      const { fieldErrors } = validateFields.error.flatten();
      return set_Zod_Response({success: false, emailError: fieldErrors?.email?.[0] || ""})
    };
    set_Loading_Boolean(true); // loading 開始動畫

    // 7. 執行 忘記密碼API
    try {
      const forget_Password_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/forgot-password";
      const api_Response = await fetch(forget_Password_Url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email})
      });

      const data = await api_Response.json();
      if(!api_Response.ok) {
        console.log(data, "忘記密碼執行失敗");
        set_Response(data);
        toast.error(data.message)
      } else {
        console.log(data, "忘記密碼執行成功");
        set_Response(data);
        toast.success(data.message);
        await sleep(3000);
        router.push("/");
      }
    }
    catch (error) {
      console.error(error, "忘記密碼執行失敗");
    }
    finally {
      set_Loading_Boolean(false);
    }
  };

  // 8. next-intl i18n-翻譯
  const t = useTranslations("Auth");


  return <>

    <div className="flex flex-col bg-primary h-screen relative lg:bg-[#F3F3F3] lg:min-h-[75vh] lg:mx-auto lg:justify-center">
      <p className="text-white text-center p-4 lg:hidden">{t ("Forget Password")}</p>
      <div className="absolute top-4 left-4 h-[56px] lg:hidden">
        <button type="button" className="" onClick={()=> router.back()}>
          {/* <Link href={referer}> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          {/* </Link> */}
        </button>
      </div>

      {/* Login表單 */}
      {/* <Server_Form_Login></Server_Form_Login> */}


      <div className="relative">
      <img src="/Logo.svg" className="absolute left-[50%] -translate-x-1/2 w-20 h-20" alt="" /> 
    </div>
      
    <div className="my-bg-gradient min-h-screen flex flex-col mt-10 lg:bg-white lg:mx-auto lg:py-4 lg:rounded lg:shadow-lg lg:min-h-[60vh]">
      {/** 電子郵件 SVG */}
      <div className="relative">
        <img src="/account/Email.svg" alt="" className="absolute top-[6.85rem] left-8"/>
      </div>
      {/** 電子郵件 SVG */}

      <form onSubmit={handle_Foget_Password} className="flex flex-col px-4 pt-14 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="email" className="text-gray">{t ("Enter Email")}</label>
        <input type="text" id="email" name="email" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"
          value={email} onChange={(event) => setEmail(event.target.value)}/>
        <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        {/* <Client_Input_Password password={password} setPassword={setPassword}></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-customRed">{response?.passwordError}</p> */}
        {/* 密碼 */}
        
        {loading_Boolean ?
          <button type="button" className="bg-softGray flex justify-center items-center rounded-lg py-3 gap-2" disabled>
            <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            {t ("Processing") + "..."}
          </button>
          :
          <button className="bg-primary rounded-lg py-3 text-white">{t ("Sent")}</button>
        }
      </form>
      
      <div className="pt-4 flex flex-col justify-center items-center gap-4">
        <p className="text-gray">{t ("Don't have an account?")} <Link href={'/register'} className="text-primary font-semibold">{t ("Register")}</Link></p>

        {/* <p className="text-center text-sm">{t ("Or Sign in With")}</p>
        <button className="bg-white rounded-lg py-3 px-6 lg:shadow-lg" type="button">
          <img src="/account/Google.svg" alt="" />
        </button> */}
      </div>
      
    </div>
      {/* Login表單 */}
    </div>
  </>

}