'use client';
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Swiper_Hotel_Detail from "@/components/swiper_Hotel_Detail/swiper_Hotel_Detail";
import { HomeSVG } from "@/components/client_Svg/client_Svg";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
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

  // 5. Redux - 被預訂飯店之房型
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  console.log(redux_Booked_Room, "Redux - 被預訂之房型");
  
  
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
      <Swiper_Hotel_Detail redux_Booked_Room={redux_Booked_Room}></Swiper_Hotel_Detail>
      {/** Swiper 飯店圖片 */}
      

      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}
      <div className="flex flex-col pb-4 border border-softGray rounded p-2 gap-4">
        <div className="flex justify-between flex-wrap">
          <p className="font-bold text-xl">{redux_Hotel_Detail.name}</p>
          <div className="flex items-center gap-x-1">
            <HomeSVG name={"Star"} className="w-3 h-auto"></HomeSVG>
            <p className="text-xs text-gray">{redux_Hotel_Detail?.rating}</p>
            <p className="text-xs text-gray">({redux_Hotel_Detail?.reviews.length + " reviews"})</p>
          </div>
        </div>
        <p className="text-xs text-gray">{redux_Hotel_Detail.address}</p>

        {/** 房型 */}
        <div className="flex gap-2">
          <p className="text-lg font-semibold">{redux_Booked_Room.roomType.charAt(0).toUpperCase() + redux_Booked_Room.roomType.slice(1)}</p>
            {/** 吸菸|禁菸 */}
            {redux_Booked_Room.smoke ? 
            <div className="flex gap-2 bg-softGray p-1 rounded text-sm">
              <OtherSVG name={"smoking"} className="w-4 h-auto"></OtherSVG> 
              Smoking Room
            </div> 
            : <div className="flex gap-2 bg-softGray p-1 rounded text-sm">
              <OtherSVG name={"nosmoking"} className="w-4 h-auto"></OtherSVG> 
              No-Smoking
            </div>}
            {/** 吸菸|禁菸 */}
        </div>
        {/** 房型 */}

        {/** 入住時間 */}
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <OtherSVG name={"time"} className="w-4 h-auto"></OtherSVG>
            <p>Chekc In</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.dateRange?.slice(0,10) + " After 15:00"}</p>
        </div>
        {/** 入住時間 */}
        
        {/** 退房時間 */}
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <OtherSVG name={"time"} className="w-4 h-auto"></OtherSVG>
            <p>Chekc Out</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.dateRange?.slice(13) + " Before 11:00"} </p>
        </div>
        {/** 退房時間 */}
        
        {/** 幾間房 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"bed"} className="w-4 h-auto"></OtherSVG>
            <p>Number of Roooms</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.room + " Room(s)"}</p>
        </div>
        {/** 幾間房 */}

        {/** 住幾晚 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"night"} className="w-4 h-auto"></OtherSVG>
            <p>Number of Nights</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{nights + " Night(s)"}</p>
        </div>
        {/** 住幾晚 */}

        {/** 住幾人 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"user"} className="w-4 h-auto"></OtherSVG>
            <p>Number of People</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{`${redux_Fomr_Search.adult}  Adult(s)`} {`${redux_Fomr_Search.child >0 ? redux_Fomr_Search.child + ' Child(s)'  : ''}`}</p>
        </div>
        {/** 住幾人 */}
        
      </div>
      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}

      {/* <div className="flex justify-between">
        <div className="flex flex-col">
          <p>Check In</p>
          <p className="font-bold">{redux_Fomr_Search.dateRange?.slice(0,10)}</p>
        </div>
        <p className="border-r border-gray"></p>
        <div className="flex flex-col">
          <p>Check Out</p>
          <p className="font-bold">{`(${redux_Fomr_Search.adult}  Adults`} {`${redux_Fomr_Search.child >0 ? redux_Fomr_Search.child + ' Childs'  : ''})`}</p>
        </div>
      </div>
      <div className="border-t border-gray"></div>
      <div className="flex gap-x-1">
        <p className="text-sm font-semibold">{nights + " Nights,"}</p>
        <p className="text-sm font-semibold">{redux_Fomr_Search.room + " Rooms"}</p>
        <p className="text-sm font-semibold">{`(${redux_Fomr_Search.adult}  Adults`} {`${redux_Fomr_Search.child >0 ? redux_Fomr_Search.child + ' Childs'  : ''})`}</p>
      </div>
      <p className="border-b border-gray"></p> */}

      {/** 付款<Form>表單 */}
      <Server_Form_Pay></Server_Form_Pay>
      {/** 付款<Form>表單 */}









    </div>
    {/** 外層背景 */}
  </>
}