import React from "react";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import Form_Search_Pc from "@/components/form_Search/form_Search_Pc";
import Client_Show_Keyword from "@/components/client-Show-Keyword";
import Link from "next/link";

export default function HotelList_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
    {/************************ PC桌機版 - 導覽頁 ************************/}
      <Nav></Nav>
    {/************************ PC桌機版 - 導覽頁 ************************/}


    {/************************ 手機版 - 返回上頁 + 彈窗搜尋<form> ************************/}
      <nav className="sticky top-0 left-0 right-0 bg-primary z-40 lg:hidden">
        <div className="px-4 h-[72px] flex items-center gap-4">
          <button type="button" className="basis-1/12">
            <Link href={'/'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
          </button>
          <div className="basis-11/12">
            <Client_Show_Keyword></Client_Show_Keyword>
          </div>
        </div>
      </nav>
    {/************************ 手機版 - 返回上頁 + 彈窗搜尋<form> ************************/}


    {/************************ PC桌機版 - 搜尋<form> ************************/}
      <div className="hidden lg:block lg:fixed lg:top-[70px] lg:w-full lg:z-10">
        <Form_Search_Pc></Form_Search_Pc>
      </div>
    {/************************ PC桌機版 - 搜尋<form> ************************/}
      
      {children}

    {/************************ PC桌機版 - <Footer> ************************/}
      <div className="lg:px-4">
        <Footer></Footer>
      </div>
    {/************************ PC桌機版 - <Footer> ************************/}
    </>
  );
}


