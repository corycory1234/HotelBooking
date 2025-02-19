'use client';
import { usePathname } from "next/navigation";
import { OtherSVG } from "../client_Svg/client_Svg";
import {useLocale, useTranslations} from 'next-intl';

export default function Payment_Progress_Bar () {
  const pathname = usePathname();

  // 1. next-intl: i18n翻譯
  const locale = useLocale();

  return <div className="flex flex-col gap-1">
  <div className="flex justify-center items-center gap-2 lg:mt-[70px]">
    {pathname === `/${locale}/creditcard` || pathname === `/${locale}/bookingcompleted` ? 
    <div className="bg-primary rounded-full p-1">
      <OtherSVG name="tick2" className="w-4 h-auto"></OtherSVG>
    </div>
    :
    <p className="bg-primary rounded-full px-2 text-white">1</p>
    }

    <p className={`${pathname === `/${locale}/creditcard` || pathname === `/${locale}/bookingcompleted`  ? 'border-primary' : 'border-softGray'} border border-r w-1/6`}></p>

    {pathname === `/${locale}/bookingcompleted` ? 
    <div className="bg-primary rounded-full p-1">
      <OtherSVG name="tick2" className="w-4 h-auto"></OtherSVG>
    </div>
    :
    <p className={`${pathname === "/creditcard" ? 'bg-primary' : 'bg-softGray' } rounded-full px-2 text-white`}>2</p>
    }

    <p className={`${pathname === `/${locale}/bookingcompleted`  ? 'border-primary' : 'border-softGray'} border border-r w-1/6`}></p>
    
    {pathname === `/${locale}/bookingcompleted` ? 
    <div className="bg-primary rounded-full p-1">
      <OtherSVG name="tick2" className="w-4 h-auto"></OtherSVG>
    </div>
    :
    <p className={`${pathname === `/${locale}/bookingcompleted` ? 'bg-primary' : 'bg-softGray'} rounded-full px-2 text-white`}>3</p>
    }
    
  </div>
  
  <div className="hidden lg:flex justify-center items-center gap-2">
    <p className="font-semibold text-sm">Guest Information</p>
    <p className="border border-r border-transparent w-1/12"></p>
    <p className="font-semibold text-sm">Credit Card Info</p>
    <p className="border border-r border-transparent w-1/12"></p>
    <p className="font-semibold text-sm">Booking Confirmed</p>
  </div>
  
  </div>
}