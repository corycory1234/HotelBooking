'use client';
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Swiper_Hotel_Detail from "@/components/swiper_Hotel_Detail/swiper_Hotel_Detail";
import { HomeSVG } from "@/components/client_Svg/client_Svg";
import Server_Form_Pay from "@/components/server_Form_Pay/server_Form_Pay";
import how_Many_Nights from "@/utils/how_Many_Nights";

export default function Payment () {
  // 1. 返回上一頁
  const router = useRouter();

  // 2. Redux - 飯店明細, props傳遞給<Swiper_Hotel_Detail>
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);

  // 3. Redux - 搜尋參數, <Form>旅客表單 需要人數、日期
  const redux_Fomr_Search = useSelector((state: RootState) => state.formSearch);

  // 4. 住幾個晚上
  const nights = how_Many_Nights(redux_Fomr_Search.dateRange?.slice(0,10), redux_Fomr_Search.dateRange?.slice(13))
  console.log("幾晚", nights);
  
  
  return <>
  
  {/* 返回上頁按鈕 */}
  <div className="bg-primary relative">
    <div className="flex flex-col py-2 cursor-pointer">
      <p className="text-center text-white">Payment</p>
    </div>

      <div className="absolute top-2 left-4 z-10 h-[56px]" onClick={() => router.back()}>
        <button type="button" className="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>
    </div>
    {/* 返回上頁按鈕 */}

    {/** 外層背景 */}
    <div className="flex flex-col p-4 gap-3 my-bg-gradient">
      
      {/** Swiper 飯店圖片 */}
      <Swiper_Hotel_Detail redux_Hotel_Detail={redux_Hotel_Detail}></Swiper_Hotel_Detail>
      {/** Swiper 飯店圖片 */}
      

      {/** 總平均評價、飯店名、飯店地址 */}
      <div className="flex flex-col pb-4 border-b border-gray">
        <div className="flex justify-between">
          <p className="text-sm">{redux_Hotel_Detail.name}</p>
          <div className="flex items-center gap-x-1">
            <HomeSVG name={"Star"} className="w-3 h-auto"></HomeSVG>
            <p className="text-xs text-gray">{redux_Hotel_Detail?.rating}</p>
            <p className="text-xs text-gray">({redux_Hotel_Detail?.reviews.length + " reviews"})</p>
          </div>
        </div>
        <p className="text-xs text-gray">{redux_Hotel_Detail.address}</p>
      </div>
      {/** 總平均評價、飯店名、飯店地址 */}

      <div className="flex justify-between">
        <div className="flex flex-col">
          <p>Check In</p>
          <p className="font-bold">{redux_Fomr_Search.dateRange?.slice(0,10)}</p>
        </div>
        <p className="border-r border-gray"></p>
        <div className="flex flex-col">
          <p>Check Out</p>
          <p className="font-bold">{redux_Fomr_Search.dateRange?.slice(13)}</p>
        </div>
      </div>
      <div className="border-t border-gray"></div>
      <div className="flex gap-1">
        <p>{nights + " Nights,"}</p>
        <p>{redux_Fomr_Search.room + " Room"}</p>
        <p>{`(${redux_Fomr_Search.adult}  Adults`} {`${redux_Fomr_Search.child >0 ? redux_Fomr_Search.child + ' Childs'  : ''})`}</p>
        <p></p>
      </div>
      <p className="border-b border-gray"></p>

      {/** 付款<Form>表單 */}
      <Server_Form_Pay></Server_Form_Pay>
      {/** 付款<Form>表單 */}









    </div>
    {/** 外層背景 */}
  </>
}