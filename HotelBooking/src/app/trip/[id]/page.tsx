"use client";
import { useParams } from "next/navigation";
import Booking_List_Json from "@/fakeData/trip_List.json";
import Previous_Page from "@/components/previous_Page/previous_Page";
import how_Many_Nights from "@/utils/how_Many_Nights";
import { FacilitySVG } from "@/components/client_Svg/client_Svg";

export default function Booking_Detail () {

  // 1. 匹配「指定訂單」
  const params = useParams();
  const booking_Detail = Booking_List_Json.find((item) => item.booking_Id === params.id);
  console.log(booking_Detail, "指定訂單");
  
  // 2. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "Booking Details"

  // 3. 用 day.js 計算住幾晚
  const nights = how_Many_Nights(booking_Detail?.checkin, booking_Detail?.checkout);
  console.log("住幾晚", nights);

  return <div className="flex flex-col">
      {/** 返回上一頁 */}
      <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
      {/** 返回上一頁 */}

      {/** 房型圖片 */}
      <img src={booking_Detail?.booking_Img} alt="" />
      {/** 房型圖片 */}
      
    <div className="flex flex-col p-4 gap-2">'

      {/** 留言評價 or 查看評價 */}
        {<div className="bg-white flex flex-col rounded-lg">
          <p className="text-center">Booking ID {booking_Detail?.booking_Id}</p>
          <div className="p-2">
            <button type="button" className="bg-secondary rounded text-white w-full py-2">
              {booking_Detail?.booking_Status === "completed" ? 'Review Your Stay' : 'See Review'}
            </button>
          </div>
          </div>}
      {/** 留言評價 or 查看評價 */}


      
      {/** 飯店名、訂單狀態、房型名稱 */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{booking_Detail?.hotel_Name}</p>
            <span className={`rounded-full py-1 px-2 w-fit 
              ${booking_Detail?.booking_Status === "cancelled" ? 'bg-red-300 text-red-700'  : 'bg-green-200 text-green-700'}`}
            >
              {booking_Detail?.booking_Status}
            </span>
          </div>
          <p className="text-gray">{booking_Detail?.room_Type}</p>
        </div>
      {/** 飯店名、訂單狀態、房型名稱 */}


        <div className="bg-white flex flex-col rounded-lg p-2 gap-2">
          <p className="font-semibold text-sm">Stay Details</p>
          {/** 入住、退房時間 */}
          <div className="flex">
            <div className="w-1/2 flex flex-col">
              <p className="text-sm text-gray">Check-In</p>
              <p>{booking_Detail?.checkin}</p>
              <p className="text-sm text-gray">From: 15:00</p>
            </div>
            <div className="w-1/2 flex flex-col">
              <p className="text-sm text-gray">Check-Out</p>
              <p>{booking_Detail?.checkout}</p>
              <p className="text-sm text-gray">Until: 12:00</p>
            </div>
          </div>
          {/** 入住、退房時間 */}

          <div className="border-b border-softGray"></div>
          
          {/** 住幾晚、住幾個人 */}
          <div className="flex justify-between">
            <p className="text-sm text-gray">Duration</p>
            <p>{`${nights} nigths`}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray">Guest</p>
            <p>{`2 adults, 2 childs 待`} </p>
          </div>
          {/** 住幾晚、住幾個人 */}
        </div>


        {/** 房型內部設施 */}
        <div className="bg-white flex flex-col rounded-lg p-2 gap-2">
          <p className="text-sm font-semibold">Room Details</p>
          <div className="flex flex-col">
            <div className="flex">
              <div className="w-1/2 flex gap-2">
                <FacilitySVG name={"gym"} className="w-4 h-auto"></FacilitySVG>
                <p>GYM</p>
              </div>
              <div className="w-1/2 flex gap-2">
                <FacilitySVG name={"ktv"} className="w-4 h-auto"></FacilitySVG>
                <p>KTV</p>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 flex gap-2">
                <FacilitySVG name={"bar"} className="w-4 h-auto"></FacilitySVG>
                <p>BAR</p>
              </div>
              <div className="w-1/2 flex gap-2">
                <FacilitySVG name={"spa"} className="w-4 h-auto"></FacilitySVG>
                <p>SPA</p>
              </div>
            </div>
          </div>
        </div>
        {/** 房型內部設施 */}
        

        {/** 費用、稅率 */}
        <div className="bg-white flex flex-col rounded-lg p-2 gap-2">
          <p className="text-sm font-semibold">Price Details</p>
          <div className="flex justify-between">
            <p className="text-sm text-gray">{`Room Price (${nights} nights)`}</p>
            <p>{`$ ${booking_Detail?.price}`}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray">Taxes and Fees</p>
            <p>{`$ 待補數據`}</p>
          </div>
        </div>
        {/** 費用、稅率 */}
        
        {/** 地圖 */}
        <div className="bg-white flex flex-col rounded-lg p-2 gap-2">
          <p className="text-sm font-semibold">Location - 地圖尚未實作</p>
          <img src="/triplist/location.png" alt="" />
          <p className="text-sm text-gray">100 Ocean Drive, Miami Beach, FL 33139, United States</p>
          <button type="button" className="bg-primary text-white rounded py-2">Get Directions</button>
        </div>
        {/** 地圖 */}
  
    </div>
  </div>
}