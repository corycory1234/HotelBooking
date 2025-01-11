'use client';
import { DashboardSVG } from "../client_Svg/client_Svg";
import { useState } from "react";
import Link from "next/link";

const dashboard_Menu = ["Dashboard", "Hotels", "Bookings", "Reviews", "Promotions", "Coupons"];

export default function Side_Bar () {
  
  // 1. 點擊 Menu 高亮
  const [clicked_Menu, set_Clicked_Menu] = useState(0);
  const handle_Cliked_Menu = (num: number) => {
    set_Clicked_Menu(num)
  } 

  return <>
  <div className="flex flex-col h-full gap-10 border-r border-softGray">
    <div className="border-b border-softGray h-[66px] flex justify-center">
      <Link href={"/"}>
        <img className="h-full" src="/Logo.svg" alt="" />
      </Link>
    </div>
    
    {dashboard_Menu.map((item, index) => {
      return (
        <div key={index} className="flex flex-col pl-4">
          <div className={`flex gap-2 cursor-pointer ${index === clicked_Menu ? 'bg-strokeGray rounded' : ''}`} 
            onClick={() => handle_Cliked_Menu(index)}>
            <DashboardSVG name={item} className="w-4 h-auto"></DashboardSVG>
            <p>{item}</p>
          </div>
        </div>
      )
    })}
  </div>
  </>
}