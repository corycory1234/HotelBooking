'use client';
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { OtherSVG } from "../client_Svg/client_Svg";
import Full_Half_Modal from "../modal/full-half-modal";
import Before_Login_Profile from "../profile/before_login_profile";
import { usePathname, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import {useLocale, useTranslations} from 'next-intl';
import { useRouter, usePathname as i18n_usePathname } from "@/i18n/routing";
import Click_Outside from "../clickOutside";

export default function Nav () {
  // 1. 滾動錨點 - 布林
  const [is_Scrolled, set_Is_Scrolled] = useState<boolean>(false)
  const handle_Scroll = () => {
    set_Is_Scrolled(window.scrollY > 300);
  };

  useEffect(
    () => {
      // 2. 立即執行一次初始判断
      handle_Scroll(); 
      window.addEventListener('scroll', handle_Scroll);
      // 2.1 組件卸載, 離開頁面, 清理回收機制, 防止內存外洩
      return ()=> window.removeEventListener('scroll', handle_Scroll);  
    },[])
  
  // 3. 漢堡線布林值
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false);

  // 4. 不是"/"首頁, <Nav>背景就白色
  const next_PathName = usePathname();
  const i18n_PathName = i18n_usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  // 4.1 獲取當前查詢參數
  const currentParams = new URLSearchParams(searchParams.toString());

  // 5. i18n 翻譯
  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const [toggle_i18n, set_Toggle_i18n] = useState<boolean>(false);
  // 5.1 i18n 切換語系
  const switch_i18n = (language: string) => {
    const new_Locale = language;
    // 5.2 建立全新URL路徑, 包含searchParams (不然中 -> 英, 會丟失hotellist「?所有搜尋參數」)
    const new_Path = `${i18n_PathName}?${currentParams.toString()}`;
    // 移除當前語言前綴（假設路徑格式為 /[lang]/path）
    const pathWithoutLocale = i18n_PathName.replace(/^\/[a-z-]+/, '') || '/';
    // 構建新路徑並保留參數
    // const new_Path = `${pathWithoutLocale}?${searchParams.toString()}`;
    router.replace(new_Path, {locale: new_Locale});
    // router.replace(i18n_PathName, {locale: new_Locale});
  }
  // useEffect(() => {
  //   console.log(next_PathName, "    Next的path名");
  //   console.log(i18n_PathName, "    i18n的path名");
  //   console.log(params,"    useParams名");
  // },[locale])

  // 6. 點外層, 關閉 i18n 絕對定位選單
  // 6.1 建立 ref 來追蹤 i18n 絕對定位選單 元素
  const i18n_Ref = useRef<HTMLDivElement>(null);
  Click_Outside(i18n_Ref, () => set_Toggle_i18n(false))

return <>

  <div className={`hidden ${is_Scrolled ? 'lg:bg-white' : 'lg:bg-softGray/20'} 
    lg:flex lg:justify-between lg:items-center lg:w-full
    lg:px-4 lg:py-3.5 lg:fixed lg:top-0 lg:z-50
    ${next_PathName !== `/${params.locale}` && 'lg:bg-white'}`}>
    
    <Link href={"/"}>
      {/* <img src="/Logo.svg" alt="gotour" className="hidden lg:block w-10 h-auto"/> */}
      <OtherSVG name="logo" className="w-[170%] h-auto"></OtherSVG>
    </Link>
    
  
  <div className="w-1/4 flex justify-between items-center">
  {/********* i18n 語系切換 **********/}
    <div className="flex gap-2 cursor-pointer" onClick={() => set_Toggle_i18n(!toggle_i18n)} ref={i18n_Ref}>
      <OtherSVG name="globe" className="w-5 h-auto"></OtherSVG>
      <p>{locale === 'en' ? t('en'): t('zh-TW')}</p>

      {toggle_i18n === true && 
        <div className="absolute left-1/5 top-10 bg-[#f3f3f3] flex gap-2 p-2 rounded">
          <p className={`${locale === 'en' ? 'bg-primary text-white': ''} p-1 rounded`}
            onClick={() => switch_i18n("en")}>{t ("en")}</p>
          <p className={`${locale === 'zh-TW' ? 'bg-primary': ''} p-1 rounded`}
            onClick={() => switch_i18n("zh-TW")}>{t ("zh-TW")}</p>
        </div>
      }
    </div>
   {/********* i18n 語系切換 **********/}


      <div>
        <OtherSVG name="burgermenu" className="w-7 h-auto cursor-pointer"
          onClick={() => set_Modal_Boolean(true)}>
        </OtherSVG>

        <Full_Half_Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
          <Before_Login_Profile></Before_Login_Profile>
        </Full_Half_Modal>
      </div>
    </div>
  </div>

</>

}