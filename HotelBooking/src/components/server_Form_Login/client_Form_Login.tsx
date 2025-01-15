'use client';

import Client_Input_Password from "./client_Input_Password";
import { Submit_Login } from "../../actions/login";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sleep } from "@/utils/sleep";
import { OtherSVG } from "../client_Svg/client_Svg";

// const initialState = { message: ""};

// 1. API返回 Zod 錯誤訊息 之 接口
interface response_Message_Interface {
  emailError: string;
  passwordError: string;
}

export default function Server_Form_Login () {
  const router = useRouter()

  // 1. Server Action 的狀態 與 函式
  // const [state, formAction] = useFormState(Submit_Login, initialState)
  
  //1. 本地 <input> 的狀態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, set_Response] = useState<response_Message_Interface>(); // API返回 Zod錯誤訊息狀態
  
  // 2. loading 布林開關 
  const [loading_Boolean, set_Loading_Boolean] = useState(false);

  // 3. 登入表單提交
  const handle_Login = async (event: React.FormEvent) => {
    event.preventDefault(); // 阻止瀏覽器默認提交
    set_Loading_Boolean(true); // loading 開始動畫

    try {
      const API_Response = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
      });

      const data = await API_Response.json();
      if(!API_Response.ok) {
        console.log(data, "登入失敗");
        set_Response(data);
        toast.error(data.message)
      } else {
        console.log(data, "登入成功");
        toast.success(data.message);
        set_Response(data);
        await sleep(3000);
        router.push("/");
      }
    } catch (error) {
      console.log("登入失敗", error);
    } finally {
      set_Loading_Boolean(false);
    }
  }

  // 2. 監聽 Server Action - API返回狀態，成功會跳Toast, 3秒後回首頁
  // useEffect(() => {
  //   if(state.success === true && state.message) {
  //     toast.success(state.message);
  //     setTimeout(() => {
  //       router.push("/");
  //     }, 3000)
  //   };
  //   if(state.success === false && state.message) {
  //     toast.error(state.message)
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

      <form onSubmit={handle_Login} className="flex flex-col px-4 pt-14 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="email" className="text-gray">Enter Email</label>
        <input type="text" id="email" name="email" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"
          value={email} onChange={(event) => setEmail(event.target.value)}/>
        <p aria-live="polite" className="text-lg text-customRed">{response?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        <Client_Input_Password password={password} setPassword={setPassword}></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-customRed">{response?.passwordError}</p>
        {/* 密碼 */}
        
        {loading_Boolean ?
          <button type="button" className="bg-softGray flex justify-center items-center rounded-lg py-3 gap-2" disabled>
            <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            Processing...
          </button>
          :
          <button className="bg-primary rounded-lg py-3 text-white">Sign In</button>
        }
      </form>
      
      <div className="pt-4 flex flex-col justify-center items-center gap-4">
        <p className="text-gray">Don't have an account? <Link href={'/register'} className="text-primary font-semibold">Register</Link></p>
        <Link href={'/forgetpassword'} className="text-primary font-semibold">
          <p className="text-gray hover:border-b-2 border-gray">Forget Password? </p>
        </Link>
        <p className="text-center text-sm">Or Sign in With</p>
        <button className="bg-white rounded-lg py-3 px-6" type="button">
          <img src="/account/Google.svg" alt="" />
        </button>
      </div>
      
    </div>
  </>
}