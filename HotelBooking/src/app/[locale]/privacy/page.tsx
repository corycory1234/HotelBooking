'use client';

import React from "react";
import Privacy_Polocy_Json from "@/fakeData/privacy_Policy.json";
import { useTranslations } from "next-intl";


export default function Privacy () {
  // 1. 隱私政策綁 id
  const anchor_Id = (index: number) => `section-${index}`

  // 2. 滑動至指定錨點
  const handle_Click = (event: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    event.preventDefault();
    document.getElementById(anchor_Id(index))?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  // 3.
  const t = useTranslations("Privacy")

  return <div className="flex flex-col gap-2 px-10 pt-20">
    <h2 className="text-xl font-bold">{t (Privacy_Polocy_Json.title)}</h2>
    <p className="text-xs text-gray">{t ("Published")}：{`[${Privacy_Polocy_Json.effectiveDate}]`}</p>
    <div className="border-b-2 border-softGray"></div>
    
    <p className="text-lg font-semibold">{t ("Introduction")}：</p>
    <p>{t (Privacy_Polocy_Json.introduction_en)}</p>

    <ul className="flex flex-col gap-2 pt-4 px-20">
      {Privacy_Polocy_Json.sections_en.map((item, index) => 
      <li key={index} className="customized-underline text-primary">
        <a href={`#${anchor_Id(index)}`} className="cursor-pointer"
          onClick={(event) => handle_Click(event, index)}>
          {index +1 + "."} {t (item.title)}
        </a>
        </li>)}
    </ul>

    <div className="border-b-2 border-softGray py-4"></div>
    
    <ul className="flex flex-col gap-2 pt-4 px-20">
      {Privacy_Polocy_Json.sections_en.map((item, index) => 

      <li key={index} className="flex flex-col gap-2 scroll-mt-20" id={anchor_Id(index)}>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{t (item.title)}</p>
          <p>{t (item.content)}</p>
        </div>
        <div className="border-b-2 border-softGray"></div>
      
      </li>)}
    </ul>


  </div>
}