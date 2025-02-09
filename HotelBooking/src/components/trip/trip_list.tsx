'use client';
import Previous_Page from "../previous_Page/previous_Page";
import { useEffect, useState } from "react";
import Booking_List_Json from "@/fakeData/trip_List.json";
import { useRouter } from "next/navigation";
import { Booking_Detail_Interface } from "@/types/booking_Detail";
import Not_Found from "@/components/not_Found/not_Found";

const booking_Buttons = ["Upcoming", "Completed", "Cancelled"];

export default function Trip_List () {
  // 1. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "My Bookings"

  // 2. Tab 切換訂單按鈕 - 高亮
  const [tab, set_Tab] = useState("Upcoming");

  // 3. 訂單列表 (按照訂單狀態分類)
  const [booking_List, set_Upcoming_Booking_List] = useState<Booking_Detail_Interface[]>([]);

  // 4. 點選訂單狀態分類, 取得 Upcoming 訂單狀態陣列
  const select_Booking_Status = (tab_Text: string) => {
    if(tab_Text === "Upcoming") {
      const pending_Booking = Booking_List_Json.filter((item: Booking_Detail_Interface) => {
        return item.booking_Status === "pending"
      })
      set_Upcoming_Booking_List(pending_Booking);
      set_Tab(tab_Text)
    } else if (tab_Text === "Completed") {
      const complted_Booking = Booking_List_Json.filter((item: Booking_Detail_Interface) => {
        return item.booking_Status === "completed";
      });
      set_Upcoming_Booking_List(complted_Booking);
      set_Tab(tab_Text)
    } else if (tab_Text === "Cancelled") {
      const cancelled_Booking = Booking_List_Json.filter((item: Booking_Detail_Interface) => {
        return item.booking_Status === "cancelled";
      });
      set_Upcoming_Booking_List(cancelled_Booking);
      set_Tab(tab_Text);
    }
  }

  // 5. 一進頁面, 先顯示 Upcoming訂單
  useEffect(() => {
    select_Booking_Status("Upcoming")
  },[])

  // 6. 查看「指定訂單」
  const router = useRouter()
  const view_Booking = (hotel_Id: string) => {
    router.push(`trip/${hotel_Id}`)
  }

  // 7. Skeleton動畫 - 延遲2秒 (這邊待API寫好, 於useEffect)
  const [show_Booking_List, set_Show_Booking_List] = useState<boolean>(false);
  useEffect(() => {
    set_Show_Booking_List(false) // 第2次進頁面, 從 true >> false
    const timer = setTimeout(() => {
      set_Show_Booking_List(true);
    }, 3000);
    return () => clearTimeout(timer);
  },[])

  // 8. Skeleton動畫 - 佔位符
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


  return <div className={`flex flex-col ${booking_List.length >0 ? 'pb-20' : ''} lg:pb-0`}>

  {/** 返回上一頁 */}
  <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
  {/** 返回上一頁 */}


  {/** 訂單卡片 */}
  {!show_Booking_List ? <Placeholder_Card></Placeholder_Card>

  :
  <div className={`flex flex-col p-4 gap-4  ${booking_List.length >0 ? 'customized-bg-gradient' : ''} lg:px-20 lg:bg-none lg:mt-[70px]`}>

  {/** Tab 切換訂單按鈕 */}
  {booking_List.length >0 && 
    <div className="flex gap-2 py-1 px-4 flex-wrap lg:justify-center">
      {booking_Buttons.map((item, index) => {
        return <button key={index}
          className={`text-softGray text-sm p-2 border border-softGray rounded
          ${tab === item ? 'bg-primary text-white' : ''}`}
          onClick={() => select_Booking_Status(item)}> {item}
        </button>
      })}
    </div>
  }
  {/** Tab 切換訂單按鈕 */}

    
    { 
      booking_List.length === 0 ? <Not_Found you_Have_No_Bookings="You Have No Bookings"></Not_Found> // 找不到訂單SVG
      :
      booking_List.map((item) => {
        return <div className="flex flex-col gap-4 bg-white rounded-lg px-2 py-4 lg:border border-softGray" key={item.booking_Id}>
            {/** 訂單照片、飯店名、房型名、確認|未確認|取消 */}
            <div className="flex gap-2">
              <img src={item.booking_Img} alt="" className="w-1/3 rounded"/>
              <div className="flex flex-col basis-1/2 gap-2">
                <p className="font-semibold">{item.hotel_Name}</p>
                <p className="text-sm">{item.room_Type}</p>
                <span className={`rounded p-2 w-fit 
                  ${item.booking_Status === 'cancelled' ? 'bg-red-300 text-red-700'  : 'bg-green-200 text-green-700'}`}
                >{item.booking_Status}</span>

                {/** PC桌機 - 入住日、退房日 */}
                <div className="hidden w-1/2 lg:flex flex-col">
                  <p className="text-gray">Check-In</p>
                  <p className="font-semibold">{item.start_Date}</p>
                </div>
                <div className="hidden w-1/2 lg:flex flex-col">
                  <p className="text-gray">Check-Out</p>
                  <p className="font-semibold">{item.end_Date}</p>
                </div>
              </div>
              {/** PC桌機 - 入住日、退房日 */}
              
              {/** PC桌機 - 訂單ID、查看訂單明細 */}
              <div className="self-end w-1/3 flex flex-col gap-4">
                <div className="flex justify-between">
                  <p className="text-gray">Booking ID: #{item.booking_Id}</p>
                  <p className="font-semibold">${item.price}</p>
                </div>
                <button className="bg-primary text-white rounded py-2"
                  onClick={() => view_Booking(item.booking_Id)}>View Details</button>
              </div>
              {/** PC桌機 - 訂單ID、查看訂單明細 */}
            </div>
            {/** 訂單照片、飯店名、房型名、確認|未確認|取消 */}

            <div className="border-b border-softGray lg:hidden"></div>

            {/** 入住、退房時間 */}
            <div className="flex lg:hidden">
              <div className="w-1/2 flex flex-col">
                <p className="text-gray">Check-In</p>
                <p className="font-semibold">{item.start_Date}</p>
              </div>
              <div className="w-1/2 flex flex-col">
                <p className="text-gray">Check-Out</p>
                <p className="font-semibold">{item.end_Date}</p>
              </div>
            </div>
            {/** 入住、退房時間 */}

            <div className="border-b border-softGray lg:hidden"></div>


            {/** 訂單號碼、價錢、查看訂單 */}
            <div className="flex flex-col gap-4 lg:hidden">
              <div className="flex justify-between">
                <p className="text-gray">Booking ID: #{item.booking_Id}</p>
                <p className="font-semibold">${item.price}</p>
              </div>
              <button className="bg-primary text-white rounded py-2"
                onClick={() => view_Booking(item.booking_Id)}>View Details</button>
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