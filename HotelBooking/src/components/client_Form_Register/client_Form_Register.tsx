'use client';

import Client_Input_Password from "@/components/server_Form_Login/client_Input_Password";
import Client_Input_Confirm_Password from "./client_Input_Confirm_Password";
import { Submit_Register } from "@/actions/register";
import { useFormState } from "react-dom";
import Link from "next/link";

const initialState = { message: ""};

export default function Client_Form_Register () {
  const [state, formAction] = useFormState(Submit_Register, initialState)

  return <>
  <div className="relative">
      <img src="/Logo.svg" className="absolute left-[40%] w-20 h-20" alt="" /> 
    </div>
      
    <div className="my-bg-gradient min-h-full flex flex-col mt-10">
      {/** 電子郵件 SVG */}
      <div className="relative">
        <img src="/account/Email.svg" alt="" className="absolute top-[6.85rem] left-8"/>
      </div>
      {/** 電子郵件 SVG */}

      <form action={formAction} className="flex flex-col px-4 pt-14 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="email" className="text-gray">Enter Email</label>
        <input type="text" id="email" name="email" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"/>
        <p aria-live="polite" className="text-lg text-red">{state?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        <Client_Input_Password></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-red">{state?.passwordError}</p>
        {/* 密碼 */}

        {/* 再次確認密碼 */}
        <Client_Input_Confirm_Password></Client_Input_Confirm_Password>
        <p aria-live="polite" className="text-lg text-red">{state?.confirmError}</p>
        {/* 再次確認密碼 */}
        
        <button className="bg-primary rounded-lg py-3 text-white">Register</button>
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