'use client';
import React from 'react';
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Client_Input_Password_Interface {
  password: string;
  setPassword: (value: string) => void;
}

export default function Client_Input_Password ({password, setPassword}: Client_Input_Password_Interface) {
  // 1. 眼睛開關 - 看密碼布林值
  const [password_Boolean, set_Password_Boolean] = useState(false);
  const show_Password = () => {
    set_Password_Boolean(!password_Boolean);
  }

  // 2. next-intl i18n-翻譯
  const t = useTranslations("Auth");

  return <>
  {/* 眼睛開關SVG */}
  <div className="relative">
    <img src="/account/Password.svg" alt="" className="absolute top-[4.25rem] left-4"/>
    {password_Boolean === false && 
      <img src="/account/EyeClosed.svg" alt="" className="absolute top-[4.25rem] right-4"
      onClick={show_Password}/>
    }
    {
      password_Boolean &&
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray absolute top-[4.25rem] right-4" onClick={show_Password}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    }
  </div>
  {/* 眼睛開關 */}


  <label htmlFor="password" className="text-gray">{t ("Password")}</label>
  <input type={password_Boolean ? 'text' : 'password'} id="password" name="password" className="rounded border-2 border-softGray py-2 px-10"
    value={password} onChange={(event) => setPassword(event.target.value)}/>
  
  </>
  
}