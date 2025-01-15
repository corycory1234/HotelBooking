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

// const initialState = { message: ""};

// 1. API返回 Zod 錯誤訊息 之 接口
interface response_Message_Interface {
  emailError: string;
  passwordError: string;
  confirmError: string;
};

export default function Client_Form_Register () {
  const router = useRouter();

  // 1. 本地 <input> 的狀態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [response_Msg, set_Response_Msg] = useState<response_Message_Interface>(); // API返回 Zod錯誤訊息狀態

  // 1. Server Action 的狀態 與 函式
  // const [state, formAction] = useFormState(Submit_Register, initialState);

  // 2. loading 布林開關 
  const [loading_Boolean, set_Loading_Boolean] = useState(false);

  // 3. 註冊表單提交
  const handle_Register = async (event: React.FormEvent) => {
    event.preventDefault(); // 阻止瀏覽器默認提交
    set_Loading_Boolean(true); // loading 開始動畫
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password, confirm})
      });
      const data = await response.json();
      if(!response.ok) {
        console.log(data, "註冊失敗");
        set_Response_Msg(data)
        toast.error(data.message);
      } else {
        console.log(data, "註冊成功");
        toast.success(data.message);
        await sleep(3000);
        router.push("/");
      }
    } catch (error) {
      console.log("註冊失誤", error);
    }
    set_Loading_Boolean(false); // loading 停止動畫
  };

  // 2. 監聽 Server Action - API返回狀態，成功會跳Toast, 3秒後回首頁
  // useEffect(() => {
  //   if(state.success === true && state.message) {
  //     toast.success(state.message);
  //     setTimeout(() => {
  //       router.push("/")
  //     }, 3000)
  //   };
  //   if(state.success === false && state.message) {
  //     toast.error(state.message);
  //   }
  // },[state.success, state.message])

  return <>
  <div className="relative">
      <img src="/Logo.svg" className="absolute left-[50%] -translate-x-1/2 w-20 h-20" alt="" /> 
    </div>
      
    <div className="my-bg-gradient min-h-full flex flex-col mt-10">
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
        <p aria-live="polite" className="text-lg text-customRed">{response_Msg?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        <Client_Input_Password password={password} setPassword={setPassword}></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-customRed">{response_Msg?.passwordError}</p>
        {/* 密碼 */}

        {/* 再次確認密碼 */}
        <Client_Input_Confirm_Password confirm={confirm} setConfirm={setConfirm}></Client_Input_Confirm_Password>
        <p aria-live="polite" className="text-lg text-customRed">{response_Msg?.confirmError}</p>
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
      
      <div className="pt-4 flex flex-col justify-center items-center gap-4">
        <p className="text-gray">Already have account? <Link href={'/auth'} className="text-primary font-semibold">Sign In</Link></p>
        <p className="text-center text-sm">Or Sign in With</p>
        <button className="bg-white rounded-lg py-3 px-6" type="button">
          <img src="/account/Google.svg" alt="" />
        </button>
      </div>
      
    </div>
  </>
}