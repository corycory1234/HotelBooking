'use client';

import { ProfileSVG } from "../client_Svg/client_Svg";
import { useState, useEffect } from "react";
import Link from "next/link";

const language_List = ["zh-TW", "en-US"];

export default function Profile () {
  // 1. 多國語系切換 - 如果是 zh-TW, 就吃zh-TW; 若不是, 一率吃en-US
  const [language, set_Language] = useState<string>(language_List.includes(navigator.language) ? navigator.language : "en-US")
  const switch_Language = (new_Language: string) => {
    set_Language(new_Language)
  }


  useEffect(() => {
    console.log("uesEffect監聽多語系", language);
  },[language])
  
  return <div className="pb-20">
  {/** 登入 */}
    <div className="bg-primary flex flex-col items-center gap-2 p-8">
      <div className="rounded-full bg-softGray p-2">
        <ProfileSVG name={"user"} className="w-10 h-auto"></ProfileSVG>
      </div>
      <p className="text-white">Sign in to see deals and manage your trip</p>
      <Link href={"/auth"}>
        <button type="button" className="bg-green-700 text-white rounded p-2">Sing In</button>
      </Link>
    </div>
  {/** 登入 */}


  <div className="customized-bg-gradient flex flex-col gap-4 p-4">

    {/** 多國語系切換 */}
    <div className="flex justify-between">
      <ProfileSVG name={"language"} className="w-5 h-auto" ></ProfileSVG>
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