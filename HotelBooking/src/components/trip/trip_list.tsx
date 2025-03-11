'use client';
import Previous_Page from "../previous_Page/previous_Page";
import { useEffect, useMemo, useState } from "react";
import Booking_List_Json from "@/fakeData/trip_List.json";
import { useRouter } from "next/navigation";
import { Booking_Detail_Interface } from "@/types/booking_Detail";
import Not_Found from "@/components/not_Found/not_Found";
import Refresh_Token from "@/utils/refresh_Token";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const booking_Buttons = ["Upcoming", "Completed", "Cancelled"];

export default function Trip_List () {
  // 0 . Redux - 令牌
  const redux_Access_Token = useSelector((state: RootState) => state.access_Token.data.tokens.access_token);

  // 1. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "My Bookings"

  // 2. Tab 切換訂單按鈕 - 高亮
  const [tab, set_Tab] = useState("Upcoming");

  // 3. 訂單列表 (按照訂單狀態分類)
  const [booking_List, set_Upcoming_Booking_List] = useState<Booking_Detail_Interface[]>([]);

  // 4. 查看「指定訂單」
  const router = useRouter()
  const view_Booking = (booking_Id: string) => {
    router.push(`trip/${booking_Id}`)
  }

  // 5. Skeleton動畫 - 本地狀態
  const [show_Booking_List, set_Show_Booking_List] = useState<boolean>(false);

  // 6. Skeleton動畫 - 佔位符
  const Placeholder_Card = () => {
    return <div className="flex flex-col gap-2 p-4 lg:px-20 lg:mt-[70px]">
      <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
      <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
      <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

      <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
      <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
      <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

      <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
      <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
      <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>
    </div>
  }

  // 7. 我的訂單 - API
  const my_Bookings_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/bookings/my-bookings";
  const [my_Booking_List, set_My_Booking_List] = useState<any[]>([]);
  const get_My_Booking = async () => {
    try {
      set_Show_Booking_List(false);
      // await Refresh_Token();
      const response = await fetch(my_Bookings_Url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${redux_Access_Token}`
        },
        credentials: 'include'
      });
      if(!response.ok) {throw new Error(`伺服器錯誤`)};
      const result = await response.json();
      set_My_Booking_List(result.data)
    } catch (error) {
      console.log(error);
    } finally {
      set_Show_Booking_List(true);
    }
  };

  // 8. 一進 /trip, 串接我的訂單 - API
  useEffect(() => {
    get_My_Booking()
  },[]);
  // useEffect(() => {
  //   console.log(my_Booking_List, "我的訂單, API返回數據");
  // },[my_Booking_List]);

  // 9.  點選訂單狀態分類, 一進頁面, 取得 Upcoming 訂單狀態陣列, 
  // 9.1 一定要用 useMemo 去拆分status狀態
  const filtered_Bookings = useMemo(() => {
    if(tab === "Upcoming") {
      return my_Booking_List.filter((item: any) => item.status === "pending");
    } else if (tab === "Completed") {
      return my_Booking_List.filter((item: any) => item.status === "confirmed");
    } else if (tab === "Cancelled") {
      return my_Booking_List.filter((item: any) => item.status === "cancelled");
    }
  },[tab, my_Booking_List]);

  // 10. next-intl i18n-翻譯
  const t = useTranslations("TripList");


  return <div className={`flex flex-col ${my_Booking_List.length >0 ? 'pb-20' : ''} lg:pb-0`}>

  {/** 返回上一頁 */}
  <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
  {/** 返回上一頁 */}


  {/** 訂單卡片 */}
  {!show_Booking_List ? <Placeholder_Card></Placeholder_Card>

  :
  <div className={`flex flex-col p-4 gap-4  ${my_Booking_List.length >0 ? 'customized-bg-gradient' : ''} lg:px-20 lg:bg-none lg:mt-[70px]`}>

  {/** Tab 切換訂單按鈕 */}
  {my_Booking_List.length >0 && 
    <div className="flex gap-1 py-1 flex-wrap justify-center">
      {booking_Buttons.map((item, index) => {
        return <button key={index}
          className={`text-softGray text-sm p-2 border border-softGray rounded
          ${tab === item ? 'bg-primary text-white' : ''}`}
          onClick={() => set_Tab(item)}> {t (item)}
        </button>
      })}
    </div>
  }
  {/** Tab 切換訂單按鈕 */}

    
    { 
      filtered_Bookings?.length === 0 && show_Booking_List === true ? <Not_Found you_Have_No_Bookings="You Have No Bookings"></Not_Found> // 找不到訂單SVG
      :
      filtered_Bookings?.map((item, index) => {
        return <div className="flex flex-col gap-4 bg-white rounded-lg px-2 py-4 lg:border border-softGray" key={index}>
            {/** 訂單照片、飯店名、房型名、確認|未確認|取消 */}
            <div className="flex flex-col lg:flex-row gap-2 lg:h-full">
              <div className="object-cover">
                <img src={item.bookingImage} alt="" className="w-full h-[200px] lg:w-[330px] lg:h-[265px] rounded"/>
              </div>
              <div className="flex flex-col basis-1/2 gap-2">
                <p className="font-semibold">{item.hotel_Name}</p>
                <p className="text-sm">{t (item.roomTypes.room_Type)}</p>
                <div className="flex justify-between items-center">
                  <span className={`rounded p-2 w-fit 
                    ${item.status === 'cancelled' ? 'bg-red-300 text-red-700'  : 'bg-green-200 text-green-700'}`}
                  >{t (item.status)}</span>
                  <p className="font-semibold text-right lg:hidden">{t ("Total Price")}: ${(+ item.totalPrice).toFixed()}</p>
                </div>

                {/** PC桌機 - 入住日、退房日 */}
                <div className="hidden w-1/2 lg:flex flex-col">
                  <p className="text-gray">{t ("Check-In")}</p>
                  <p className="font-semibold">{item.checkInDate}</p>
                </div>
                <div className="hidden w-1/2 lg:flex flex-col">
                  <p className="text-gray">{t ("Check-Out")}</p>
                  <p className="font-semibold">{item.checkOutDate}</p>
                </div>
              </div>
              {/** PC桌機 - 入住日、退房日 */}
              
              {/** PC桌機 - 訂單ID、查看訂單明細 */}
              <div className="self-end w-1/3 flex flex-col gap-4">
                <p className="hidden lg:block text-gray">{t ("Booking ID")}: #{item.id}</p>
                <p className="hidden lg:block font-semibold text-right">${(+ item.totalPrice).toFixed()}</p>
                <button className="hidden lg:block bg-primary text-white rounded py-2"
                  onClick={() => view_Booking(item.id)}>{t ("View Details")}</button>
              </div>
              {/** PC桌機 - 訂單ID、查看訂單明細 */}
            </div>
            {/** 訂單照片、飯店名、房型名、確認|未確認|取消 */}

            <div className="border-b border-softGray lg:hidden"></div>

            {/** 入住、退房時間 */}
            <div className="flex lg:hidden">
              <div className="w-1/2 flex flex-col">
                <p className="text-gray">{t ("Check-In")}</p>
                <p className="font-semibold">{item.checkInDate}</p>
              </div>
              <div className="w-1/2 flex flex-col">
                <p className="text-gray">{t ("Check-Out")}</p>
                <p className="font-semibold">{item.checkOutDate}</p>
              </div>
            </div>
            {/** 入住、退房時間 */}

            <div className="border-b border-softGray lg:hidden"></div>


            {/** 訂單號碼、價錢、查看訂單 */}
            <div className="flex flex-col gap-4 lg:hidden">
              <p className="text-gray">{t ("Booking ID")}: #{item.id}</p>
              {/* <div className="flex justify-between">
              </div> */}
                {/* <p className="font-semibold">${item.totalPrice}</p> */}
              <button className="bg-primary text-white rounded py-2"
                onClick={() => view_Booking(item.id)}>{t ("View Details")}</button>
            </div>
            {/** 訂單號碼、價錢、查看訂單 */}
          </div>        
      })
    }

  </div>
  }
  {/** 訂單卡片 */}
  
  </div>
}