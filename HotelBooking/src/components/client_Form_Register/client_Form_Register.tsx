'use client';

import Client_Input_Password from "@/components/server_Form_Login/client_Input_Password";
import Client_Input_Confirm_Password from "./client_Input_Confirm_Password";
import { Submit_Register } from "@/actions/register";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OtherSVG } from "../client_Svg/client_Svg";
import { sleep } from "@/utils/sleep";
import { z } from "zod";

// const initialState = { message: ""};

// 1. 密碼最小8, 最長20, 必須有1個字母大寫
const schema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string()
    .min(8, { message: "Must be 8 or more characters long" })
    .max(20, { message: "Must be 12 or fewer characters long" })
    .refine((value) => /[A-Z]/.test(value), {message: "Must Contain 1 Upper Character"}),
  // 1.1 Zod 校驗「密碼」與「再次確認密碼」  
  confirm: z.string()
}).refine((data) => data.password === data.confirm, 
{
  message: "Password doesn't match",
  path: ["confirm"] // 這裡表示，如果不符合，會把錯誤提示掛在 confirm 這個欄位上
});


// 2. API返回 Zod 錯誤訊息 之 接口
interface zod_Response_Interface {
  success: boolean;
  emailError: string;
  passwordError: string;
  confirmError: string;
};

export default function Client_Form_Register () {
  const router = useRouter();

  // 3. 本地 <input> 的狀態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const name = "tester"; // 後端額外需要之欄位
  const userType = "hotelier"; // 後端額外需要之欄位

  // 4. 接 Zod 錯誤訊息之 response
  const [zod_Response, set_Zod_Response] = useState<zod_Response_Interface>(); // API返回 Zod錯誤訊息狀態

  // 5. 監聽 API返回 response 之數據
  const[response, set_Response] = useState();
  useEffect(() => {
    console.log("API返回數據", response);
  },[response])

  // Server Action 的狀態 與 函式
  // const [state, formAction] = useFormState(Submit_Register, initialState);

  // 6. loading 布林開關 
  const [loading_Boolean, set_Loading_Boolean] = useState(false);

  // 7. 註冊表單提交
  const handle_Register = async (event: React.FormEvent) => {
    event.preventDefault(); // 阻止瀏覽器默認提交
    set_Loading_Boolean(true); // loading 開始動畫
    const register_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/register";

    try {
    // 7. zod 校驗
    const validateFields = schema.safeParse({email, password, confirm});
    //  7.1 zod 校驗之錯誤訊息
    if(!validateFields.success) {
      const { fieldErrors } = validateFields.error.flatten();
      return set_Zod_Response({success: false, 
        emailError: fieldErrors.email?.[0] || "", // 只取第一個錯誤訊息
        passwordError: fieldErrors.password?.[0] || "",
        confirmError: fieldErrors.confirm?.[0] || ""
      })
    };

      // 8. 開始串接 API接口
      const api_Response = await fetch(register_Url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password, confirm, name, userType})
      });
      const data = await api_Response.json();

      if(!api_Response.ok) {
        // console.log(data, "註冊失敗");
        set_Response(data)
        toast.error("Regisration Failed");
      } else {
        // console.log(data, "註冊成功");
        toast.success("Regisration OK");
        await sleep(3000);
        router.push("/");
      }
    } catch (error) {
      console.log("註冊失誤", error);
    } finally {
      set_Loading_Boolean(false); // loading 停止動畫
    }
  };


  return <>
      
    <div className="my-bg-gradient h-screen flex flex-col mt-10 lg:bg-white lg:shadow-lg lg:rounded lg:h-full lg:mt-20 lg:mx-auto">
      <div className="relative">
        <img src="/Logo.svg" className="absolute left-[50%] -translate-x-1/2 w-20 h-20 -top-5" alt="" /> 
      </div>

      {/** 電子郵件 SVG */}
      <div className="relative">
        <img src="/account/Email.svg" alt="" className="absolute top-[6.85rem] left-8"/>
      </div>
      {/** 電子郵件 SVG */}

      <form onSubmit={handle_Register} className="flex flex-col px-4 pt-14 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="email" className="text-gray">Enter Email</label>
        <input type="text" id="email" name="email" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"
          value={email} onChange={(event) => setEmail(event.target.value)}/>
        <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        <Client_Input_Password password={password} setPassword={setPassword}></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.passwordError}</p>
        {/* 密碼 */}

        {/* 再次確認密碼 */}
        <Client_Input_Confirm_Password confirm={confirm} setConfirm={setConfirm}></Client_Input_Confirm_Password>
        <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.confirmError}</p>
        {/* 再次確認密碼 */}
        
        {/** 註冊按鈕、loading按鈕切換 */}
        {loading_Boolean ? (
          <button type="button" className="bg-softGray flex justify-center items-center rounded-lg py-3 gap-2" disabled>
            <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            Processing...
          </button>
          )
          : (
            <button className="bg-primary rounded-lg py-3 text-white">Register</button>
          )
        }
        {/** 註冊按鈕、loading按鈕切換 */}
        
      </form>
      
      <div className="pt-4 flex flex-col justify-center items-center gap-4 my-bg-gradient lg:bg-white py-2 rounded">
        <p className="text-gray">Already have account? <Link href={'/auth'} className="text-primary font-semibold">Sign In</Link></p>
        <p className="text-center text-sm">Or Sign in With</p>
        <button className="bg-white rounded-lg py-3 px-6 lg:shadow-lg" type="button">
          <img src="/account/Google.svg" alt="" />
        </button>
      </div>
      
    </div>
  </>
}