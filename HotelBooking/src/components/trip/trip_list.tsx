'use client';
import Previous_Page from "../previous_Page/previous_Page";
import { useState } from "react";

const booking_Buttons = ["Upcoming", "Completed", "Cancelled"];


export default function Trip_List () {
  // 1. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "My Bookings"

  // 2. Tab 切換訂單按鈕 - 高亮
  const [tab, set_Tab] = useState(0);

  return <div className="flex flex-col">

  {/** 返回上一頁 */}
  <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
  {/** 返回上一頁 */}

  {/** Tab 切換訂單按鈕 */}
  <div className="flex gap-2 py-1 px-4">
    {booking_Buttons.map((item, index) => {
      return <button key={index}
        className={` text-softGray p-2 border border-gray rounded
        ${tab === index ? 'bg-primary text-white' : ''}`}
        onClick={() => set_Tab(index)}> {item}
      </button>
    })}
  </div>
  {/** Tab 切換訂單按鈕 */}

  {/** 訂單卡片 */}
  <div className="flex flex-col p-4">
    
    <div className="flex flex-col gap-4 bg-white rounded-lg px-2 py-4">
      {/** 訂單照片、飯店名、房型名、確認|未確認|取消 */}
      <div className="flex gap-2">
        <img src="/triplist/trip_1.jpg" alt="" className="w-1/3 rounded"/>
        <div className="flex flex-col basis-1/2">
          <p className="font-semibold">The Cargo Hotel</p>
          <p className="text-sm">Single Room</p>
          <span className="bg-green-200 text-green-700 rounded p-2 w-fit">Confirmed</span>
        </div>
      </div>
      {/** 訂單照片、飯店名、房型名、確認|未確認|取消 */}

      <div className="border-b border-softGray"></div>

      {/** 入住、退房時間 */}
      <div className="flex">
        <div className="w-1/2 flex flex-col">
          <p className="text-gray">Check-In</p>
          <p className="font-semibold">Dec 15, 2024</p>
        </div>
        <div className="w-1/2 flex flex-col">
          <p className="text-gray">Check-Out</p>
          <p className="font-semibold">Dec 18, 2024</p>
        </div>
      </div>
      {/** 入住、退房時間 */}

      <div className="border-b border-softGray"></div>


      {/** 訂單號碼、價錢、查看訂單 */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-gray">Booking ID: #123456</p>
          <p className="font-semibold">$1,250</p>
        </div>
        <button className="bg-primary text-white rounded py-2">View Details</button>
      </div>
      {/** 訂單號碼、價錢、查看訂單 */}



    </div>

  </div>
  {/** 訂單卡片 */}
  
  </div>
}