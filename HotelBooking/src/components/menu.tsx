// 1. 位處該路由, SVG圖片亮Primary色, 還沒處理完
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTranslations } from "next-intl";
import { usePathname as i18n_usePathname } from "@/i18n/routing";
import { useAuthState } from "@/hooks/useAuthState";

const menu = [
  {name: 'Home', svgIcon: 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>,
    url: "/"},
  {name: 'Trip', svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>,
    url: "/trip"},
  {name: "Collection", svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>,
    url: "/mycollection"},
  {name: 'Profile', svgIcon: 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>, 
    url: "/profile"},
];

const dashboard = {
  name: 'dashboard', 
  svgIcon:
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
  </svg>,
  url: "/dashboard/dashboard"
}

export default function Menu () {
  const pathName = usePathname();

  // 1. 整合的認證狀態 (Cookie + Redux)
  const { isAuthenticated, accessToken, userType, loading } = useAuthState();

  // 2. next-intl i18n 翻譯
  const t = useTranslations("Menu");

  // 3. i18n 的 Pathname
  const i18n_PathName = i18n_usePathname();

  // 4. Show loading state if still checking authentication
  if (loading) {
    return null; // or a loading spinner
  }

  return <>
    <div className="bg-white flex items-center p-4  
      fixed bottom-0 left-0 right-0 z-50 lg:hidden">

      <div className="flex-1 flex justify-between">
        {menu.map((item, index) => 
          <Link href={`${!isAuthenticated && 
            item.name === 'Trip' ? '/auth' : item.url}`} 
            className="flex flex-col items-center gap-2" key={index}>
            <div className={`${item.url === i18n_PathName ? 'text-primary' : ''}`}>
              {item.svgIcon}
            </div>
            <p className={`text-xs ${item.url === i18n_PathName ? 'text-primary' : ''}`}>{t (item.name)}</p>
          </Link>
        )}

      {/** 僅有hotelier才可進後台頁面 */}
        {userType === "hotelier" && 
        <Link href={`${dashboard.url}`} className="flex flex-col items-center gap-2">         
          <div className={`${dashboard.url === i18n_PathName ? 'text-primary' : ''}`}>
            {dashboard.svgIcon}
          </div>
          <p className={`text-xs ${dashboard.url === i18n_PathName ? 'text-primary' : ''}`}>{t (dashboard.name)}</p>
        </Link>
        }
      {/** 僅有hotelier才可進後台頁面 */}
      </div>
    </div>
  
  </>
}