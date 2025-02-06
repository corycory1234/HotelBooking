'use client';
import { OtherSVG } from "../client_Svg/client_Svg";
import { useState } from "react";

// 1. 三家信用卡
const creditCard = ["visa", "master", "jcb"]

export default function Credit_Card_List () {
  // 2. 各家信用卡 number, 對照 信用卡陣列之索引值, 以便高亮 
  const [card_Index, set_Card_Index] = useState(0);

  return <div className="flex flex-col p-4 gap-4 customized-bg-gradient lg:hidden">
    <h2 className="font-semibold">Select Payment Method</h2>

    <div className="flex gap-4 items-center">
      {creditCard.map((item, index) => {
        return  <div 
        className={`border border-softGray rounded flex gap-2 p-2 cursor-pointer w-1/3
          ${card_Index === index ? 'bg-primary' : 'bg-white'}`}
          key={index} onClick={() => set_Card_Index(index)}>

          <OtherSVG name={item} className="w-5 h-auto"></OtherSVG>
          <p className={`${card_Index === index ? 'text-white' : 'text-softGray'}`}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </p>

        </div>
      })}

    </div>

  </div>
}