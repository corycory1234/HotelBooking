'use client';
import Link from "next/link";
import { useState } from "react";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sleep } from "@/utils/sleep";

interface response_Message_Interface {
  emailError: string;
}

export default function Forget_Password() {
  const router = useRouter();

  //1. 本地 <input> 的狀態
  const [email, setEmail] = useState("");
  const [response, set_Response] = useState<response_Message_Interface>(); // API返回 Zod錯誤訊息狀態

  // 2. loading 布林開關 
  const [loading_Boolean, set_Loading_Boolean] = useState(false);

  // 3. 忘記密碼表單提交
  const handle_Foget_Password = async (event: React.FormEvent) => {
    event.preventDefault(); // 阻止瀏覽器默認提交
    set_Loading_Boolean(true); // loading 開始動畫

    try {
      const API_Response = await fetch("/api/forgetpassword", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email})
      });

      const data = await API_Response.json();
      if(!API_Response.ok) {
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
  }



  return <>

    <div className="bg-primary h-screen relative">
      <p className="text-white text-center p-4">Forget Password</p>
      <div className="absolute top-4 left-4 h-[56px]">
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
      
    <div className="my-bg-gradient min-h-full flex flex-col mt-10">
      {/** 電子郵件 SVG */}
      <div className="relative">
        <img src="/account/Email.svg" alt="" className="absolute top-[6.85rem] left-8"/>
      </div>
      {/** 電子郵件 SVG */}

      <form onSubmit={handle_Foget_Password} className="flex flex-col px-4 pt-14 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="email" className="text-gray">Enter Email</label>
        <input type="text" id="email" name="email" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"
          value={email} onChange={(event) => setEmail(event.target.value)}/>
        <p aria-live="polite" className="text-lg text-customRed">{response?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        {/* <Client_Input_Password password={password} setPassword={setPassword}></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-customRed">{response?.passwordError}</p> */}
        {/* 密碼 */}
        
        {loading_Boolean ?
          <button type="button" className="bg-softGray flex justify-center items-center rounded-lg py-3 gap-2" disabled>
            <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            Processing...
          </button>
          :
          <button className="bg-primary rounded-lg py-3 text-white">Sent</button>
        }
      </form>
      
      <div className="pt-4 flex flex-col justify-center items-center gap-4">
        <p className="text-gray">Don't have an account? <Link href={'/register'} className="text-primary font-semibold">Register</Link></p>

        <p className="text-center text-sm">Or Sign in With</p>
        <button className="bg-white rounded-lg py-3 px-6" type="button">
          <img src="/account/Google.svg" alt="" />
        </button>
      </div>
      
    </div>
      {/* Login表單 */}
    </div>
  </>

}