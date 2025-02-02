'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { OtherSVG } from "../client_Svg/client_Svg";
import Full_Half_Modal from "../modal/full-half-modal";
import Before_Login_Profile from "../profile/before_login_profile";
import { usePathname } from "next/navigation";

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
  const pathName = usePathname();


return <>

  <div className={`hidden ${is_Scrolled ? 'lg:bg-white' : 'lg:bg-softGray/20'} 
    lg:flex lg:justify-between lg:items-center lg:w-full
    lg:px-4 lg:py-2 lg:fixed lg:top-0 lg:z-50
    ${pathName !== "/" && 'lg:bg-white'}`}>
    
    <Link href={"/"}>
      <img src="/Logo.svg" alt="gotour" className="hidden lg:block w-10 h-auto"/>
    </Link>


    <div>
      <OtherSVG name="burgermenu" className="w-7 h-auto cursor-pointer"
        onClick={() => set_Modal_Boolean(true)}>
      </OtherSVG>

      <Full_Half_Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
        <Before_Login_Profile></Before_Login_Profile>
      </Full_Half_Modal>
    </div>
  </div>

</>

}