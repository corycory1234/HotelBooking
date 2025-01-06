'use client';

import Client_Input_Password from "./client_Input_Password";
import { Submit_Login } from "../../actions/login";
import { useFormState } from "react-dom";
import Link from "next/link";

const initialState = { message: ""};

export default function Server_Form_Login () {
  const [state, formAction] = useFormState(Submit_Login, initialState)


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

      <form action={formAction} className="flex flex-col px-4 pt-14 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="account" className="text-gray">Enter Email</label>
        <input type="text" id="account" name="account" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"/>
        <p aria-live="polite" className="text-lg text-customRed">{state?.emailError}</p>
        {/** 電子郵件 */}

        {/* 密碼 */}
        <Client_Input_Password></Client_Input_Password>
        <p aria-live="polite" className="text-lg text-customRed">{state?.passwordError}</p>
        {/* 密碼 */}
        
        <button className="bg-primary rounded-lg py-3 text-white">Sign In</button>
      </form>
      
      <div className="pt-4 flex flex-col justify-center items-center gap-4">
        <p className="text-gray">Don't have an account? <Link href={'/register'} className="text-primary font-semibold">Register</Link></p>
        <p className="text-center text-sm">Or Sign in With</p>
        <button className="bg-white rounded-lg py-3 px-6" type="button">
          <img src="/account/Google.svg" alt="" />
        </button>
      </div>
      
    </div>
  </>
}