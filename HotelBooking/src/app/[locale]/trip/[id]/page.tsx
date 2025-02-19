"use client";
import { useParams } from "next/navigation";
import Booking_List_Json from "@/fakeData/trip_List.json";
import Offer_List_Json from "@/fakeData/offer_List.json";
import Previous_Page from "@/components/previous_Page/previous_Page";
import how_Many_Nights from "@/utils/how_Many_Nights";
import { FacilitySVG } from "@/components/client_Svg/client_Svg";
import { FiveStarSVG } from "@/components/client_Svg/client_Svg";
import Modal from "@/components/modal/modal";
import { useEffect, useState } from "react";
import { Booking_Detail_Interface } from "@/types/booking_Detail";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { LatLngExpression } from "leaflet"; // 從 @types/leaflet 來的
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function Booking_Detail () {

  // 1. 匹配「指定訂單」
  const params = useParams();
  const booking_Detail_Json = Booking_List_Json.find((item) => item.booking_Id === params.id) as Booking_Detail_Interface;
  const [booking_Detail, set_Booking_Detail] = useState<Booking_Detail_Interface>(booking_Detail_Json);
  console.log(booking_Detail, "指定訂單");
  // 1.1 這個if判斷最好要寫哦, 不然訂單明細很多屬性都要用「?.可選鏈 or as 斷言」, 還有一堆undefined的問題...
  if(!booking_Detail){return <p>沒有此訂單</p>}
  
  // 2. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "Booking Details"

  // 3. 用 day.js 計算住幾晚
  const nights = how_Many_Nights(booking_Detail.start_Date, booking_Detail.end_Date);

  // 4. 留言彈窗
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false);
  const open_Review_Modal = () => {
    set_Modal_Boolean(!modal_Boolean)
  }

  // 5. 留言內容 - 本地State
  const [review, set_Review] = useState<string>(booking_Detail.review as string);
  const handle_Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    set_Review(event.target.value);
  };

  // 6. 滑動 1星~5星
  const [hover_Star, set_Hover_Star] = useState<number>(1);
  useEffect(() => {
    console.log("現在幾星", hover_Star);
  },[hover_Star])

  // 7. 送出 評價+留言
  const submit_Review = (event:  React.FormEvent) => {
    event.preventDefault();
    // const old_Booking = {...booking_Detail};
    // const new_Booking = {...old_Booking, review: review, star_Rating: hover_Star};
    // console.log(new_Booking, "新訂單之留言");
    set_Booking_Detail({...booking_Detail, review: review, star_Rating: hover_Star}) // 記得更新給最原先的「訂單明細本地State」
    set_Modal_Boolean(false);
    // set_Hover_Star(1); // 留言完, 清空
    // set_Review(""); // 留言完, 清空
  };


 // 8. Skeleton動畫 - 延遲2秒 (這邊待API寫好, 於useEffect)
  const [show_Booking_Detail, set_Show_Booking_Detail] = useState<boolean>(false);
  useEffect(() => {
    set_Show_Booking_Detail(false) // 第2次進頁面, 從 true >> false
    const timer = setTimeout(() => {
      set_Show_Booking_Detail(true);
    }, 2000);
    return () => clearTimeout(timer);
  },[])

  // 9. Skeleton動畫 - 佔位符
  const Placeholder_Card = () => {
    return <div className="flex flex-col gap-2 p-4">
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

  // 10. leaflet 打開地圖彈窗, 所需要的大頭針之圖檔
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  })

  // 11. 優惠券
  const offer = Offer_List_Json.find((item) => item.offer_Id === booking_Detail.offer_Id);
  const offer_Discount = 1 - (offer?.offer_Price as number);
  

  return <div className="flex flex-col">
      {/** 返回上一頁 */}
      <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
      {/** 返回上一頁 */}

      {/** 房型圖片 */}
      {/* {show_Booking_Detail && <img src={booking_Detail.booking_Img} alt="" />} */}
      {/** 房型圖片 */}
    

    {!show_Booking_Detail ? <Placeholder_Card></Placeholder_Card> 
    :
    
    <div className="flex flex-col p-4 gap-2">
      {/** 房型圖片 */}
      <img src={booking_Detail.booking_Img} alt="" className="rounded lg:hidden"/>
      {/** 房型圖片 */}

      {/** 留言評價 or 查看評價 */}
        {<div className="bg-white flex flex-col rounded-lg lg:hidden">
          <p className="text-center">Booking ID {booking_Detail?.booking_Id}</p>
            {/** 打開留言 Modal - 訂單狀態 completed 才有Modal按鈕 */}
            {booking_Detail.booking_Status === "completed" && 
              <div className="p-2">
              <button type="button" className="bg-secondary rounded text-white w-full py-2"
                onClick={open_Review_Modal}>
                {booking_Detail.booking_Status === "completed" && booking_Detail.review === "" ? 'Review Your Stay' : 'See Review'}
              </button>
              </div>
            }
            {/** 打開留言 Modal - 訂單狀態 Completed 才有Modal按鈕 */}
        </div>}

        {/** 留言彈跳視窗 */}
          <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
            <div className="flex flex-col gap-4 px-4 pt-20 z-[999] lg:hidden">
              <p className="font-semibold">Hotel: {booking_Detail.hotel_Name}</p>
              <p>Name: {booking_Detail.traveler_Name}</p>

                {/* 訂單狀態 completed, 且尚未留言, 才可進行留言 */}
                {booking_Detail.booking_Status === "completed" && booking_Detail.review === "" && <>
                  <div className="flex gap-2" >
                  {[1,2,3,4,5].map((star: number) => {
                    return <FiveStarSVG name={"emptystar"} 
                      className="w-5 h-auto hover:fill-[#ffdd00]" key={star}
                      fill={star <= hover_Star ? '#ffdd00' : 'white'}
                      onMouseEnter={() => set_Hover_Star(star)}
                      >
                    </FiveStarSVG>
                    })}
                  </div>
                  <form onSubmit={submit_Review} className="flex flex-col gap-2">
                    <textarea name="review" id="review" rows={10} cols={50} className="border px-2"
                      placeholder="Leave comment for what you experience from this Hotel"
                      value={review}
                      onChange={(event) => handle_Change(event)}>
                    </textarea>
                    <button className="bg-primary rounded text-white self-center w-1/2 py-2"
                      >Submit
                    </button>

                  </form>
                </>
              }
              {/* 訂單狀態 completed, 且尚未留言, 才可進行留言 */}


              {/* 訂單狀態 completed, 但已留言, 僅能查看 */}
              {booking_Detail.booking_Status === "completed" && booking_Detail.review !== "" && <>
                <div className="flex gap-2" >
                {Array.from({length: booking_Detail.star_Rating ?? 0}, () => booking_Detail.star_Rating ?? 0).map((star: number, index) => {
                  return <OtherSVG name={"star"} 
                    className="w-5 h-auto hover:fill-[#ffdd00]" key={index}
                    // fill={star <= hover_Star ? '#ffdd00' : 'white'}
                    // onMouseEnter={() => set_Hover_Star(star)}
                    >
                  </OtherSVG>
                  })}
                </div>
                <textarea name="review" id="review" rows={10} cols={50} className="border px-2"
                placeholder="Leave comment for what you experience from this Hotel"
                value={review} readOnly>
                </textarea>
              </>
              }
               {/* 訂單狀態 completed, 但已留言, 僅能查看 */}



              {/** 5星評價 */}

              {/** 5星評價 */}
              

            </div>
          </Modal>
        {/** 留言彈跳視窗 */}
        
      {/** 留言評價 or 查看評價 */}


      
      {/** 飯店名、訂單狀態、房型名稱 */}
        <div className="flex flex-col lg:hidden">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{booking_Detail?.hotel_Name}</p>
            <span className={`rounded-full py-1 px-2 w-fit 
              ${booking_Detail.booking_Status === "cancelled" ? 'bg-red-300 text-red-700'  : 'bg-green-200 text-green-700'}`}
            >
              {booking_Detail.booking_Status}
            </span>
          </div>
          <p className="text-gray">{booking_Detail.room_Type}</p>
        </div>
      {/** 飯店名、訂單狀態、房型名稱 */}


        <div className="bg-white flex flex-col rounded-lg p-2 gap-2 lg:hidden">
          <p className="font-semibold text-sm">Stay Details</p>
          {/** 入住、退房時間 */}
          <div className="flex lg:hidden">
            <div className="w-1/2 flex flex-col">
              <p className="text-sm text-gray">Check-In</p>
              <p>{booking_Detail.start_Date}</p>
              <p className="text-sm text-gray">{`From: ${booking_Detail.checkin}`}</p>
            </div>
            <div className="w-1/2 flex flex-col">
              <p className="text-sm text-gray">Check-Out</p>
              <p>{booking_Detail.end_Date}</p>
              <p className="text-sm text-gray">{`Until: ${booking_Detail.checkout}`}</p>
            </div>
          </div>
          {/** 入住、退房時間 */}

          <div className="border-b border-softGray lg:hidden"></div>
          
          {/** 住幾晚、住幾個人 */}
          <div className="flex justify-between lg:hidden">
            <p className="text-sm text-gray">Duration</p>
            <p>{`${nights} nigths`}</p>
          </div>
          <div className="flex justify-between lg:hidden">
            <p className="text-sm text-gray">Lead Guest</p>
            <p>{booking_Detail.traveler_Name}</p>
          </div>
          <div className="flex justify-between lg:hidden">
            <p className="text-sm text-gray">Guest</p>
            <p>{`${booking_Detail?.adults} adults 
              ${booking_Detail.childs >0  ? ','+ booking_Detail.childs + ' childs' : ''}`} 
            </p>
          </div>
          {/** 住幾晚、住幾個人 */}
        </div>


        {/** 房型內部設施 */}
        <div className="bg-white flex flex-col rounded-lg p-2 gap-2 lg:hidden">
          <p className="text-sm font-semibold">Room Details</p>
            <div className="flex flex-wrap">
              {booking_Detail.facility.map((facility, index) => {
                return <div className="w-1/2 flex gap-2" key={index}>
                    <FacilitySVG name={facility} className="w-4 h-auto"></FacilitySVG>
                    <p>{facility.charAt(0).toUpperCase() + facility.slice(1)}</p>
                  </div>
              })}
            </div>
        </div>
        {/** 房型內部設施 */}
        

        {/** 費用、稅率 */}
        <div className="bg-white flex flex-col rounded-lg p-2 gap-2 lg:hidden">
          <p className="text-sm font-semibold">Price Details</p>
          <div className="flex justify-between">
            <p className="text-sm text-gray">{`Room Price (${nights} nights)`}</p>
            <p>{`$ ${booking_Detail.price}`}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-gray">Offer Discount</p>
            <p>{((1 - offer_Discount)*100).toFixed()}% OFF</p>
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-gray">Taxes and Fees</p>
            <p>{booking_Detail.price * booking_Detail.tax }</p>
          </div>

          <div className="flex justify-between">
            <p className="text-sm font-semibold">Total Charge</p>
            <p>{`$ ${(booking_Detail.price + (booking_Detail.price * booking_Detail.tax)) * offer_Discount}`}</p>
          </div>
        </div>
        {/** 費用、稅率 */}
        
        {/** 地圖 */}
        <div className="bg-white flex flex-col rounded-lg p-2 gap-2 lg:hidden">
          <p className="text-sm font-semibold">Location</p>
          {/* <img src="/triplist/location.png" alt="" /> */}


          <MapContainer
            center={[booking_Detail?.latitude as number, booking_Detail?.longitude as number]} // 台北 101 位置
            zoom={13}
            style={{width: "100%", height: "20rem", borderRadius: "20px", zIndex: 0}}
            className="h-full">
            <TileLayer
            // 這裡使用 OpenStreetMap 免費圖資
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[booking_Detail?.latitude as number, booking_Detail?.longitude as number]}>
              <Tooltip permanent className="leaflet-tooltip ">{booking_Detail?.hotel_Name}</Tooltip>
            </Marker>
          </MapContainer>



          <p className="text-sm text-gray">{booking_Detail.address}</p>
          <button type="button" className="bg-primary text-white rounded py-2">Get Directions</button>
        </div>
        {/** 地圖 */}
      



      {/** PC桌機 */}
        <div className="hidden lg:flex lg:p-2 lg:gap-2 lg:bg-white lg:rounded">
          {/** 房型圖片 */}
          <div className="basis-1/3">
            <img src={booking_Detail.booking_Img} alt="" className="rounded"/>
          </div>
          {/** 房型圖片 */}
          
          {/** 飯店名、訂單狀態、房型名稱 */}
          <div className="basis-1/3 flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{booking_Detail?.hotel_Name}</p>
                <span className={`rounded-full py-1 px-2 w-fit 
                  ${booking_Detail.booking_Status === "cancelled" ? 'bg-red-300 text-red-700'  : 'bg-green-200 text-green-700'}`}
                >
                  {booking_Detail.booking_Status}
                </span>
              </div>
              <p className="text-gray">{booking_Detail.room_Type}</p>
            </div>

              {/** 入住、退房時間 */}
              <div className="flex">
                <div className="w-1/2 flex flex-col">
                  <p className="text-sm text-gray">Check-In</p>
                  <p>{booking_Detail.start_Date}</p>
                  <p className="text-sm text-gray">{`From: ${booking_Detail.checkin}`}</p>
                </div>
                <div className="w-1/2 flex flex-col">
                  <p className="text-sm text-gray">Check-Out</p>
                  <p>{booking_Detail.end_Date}</p>
                  <p className="text-sm text-gray">{`Until: ${booking_Detail.checkout}`}</p>
                </div>
              </div>
              {/** 入住、退房時間 */}


            </div>
          {/** 飯店名、訂單狀態、房型名稱 */}
          

          {/** 住幾晚、住幾個人 */}
          <div className="basis-1/4 self-end">
            <div className="flex gap-1 items-end">
              <p className="text-sm text-gray">Duration:</p>
              <p>{`${nights} nigths`}</p>
            </div>
            <div className="flex gap-1 items-end">
              <p className="text-sm text-gray">Lead Guest:</p>
              <p>{booking_Detail.traveler_Name}</p>
            </div>
            <div className="flex gap-1 items-end">
              <p className="text-sm text-gray">Guest:</p>
              <p>{`${booking_Detail?.adults} adults 
                ${booking_Detail.childs >0  ? ','+ booking_Detail.childs + ' childs' : ''}`} 
              </p>
            </div>
          </div>
          {/** 住幾晚、住幾個人 */}


      {/** 留言評價 or 查看評價 */}
        <div className="basis-1/4 self-end flex flex-col">
          <p className="text-sm">Booking ID {booking_Detail?.booking_Id}</p>
            {/** 打開留言 Modal - 訂單狀態 completed 才有Modal按鈕 */}
            {booking_Detail.booking_Status === "completed" && 
            <button type="button" className="bg-secondary rounded text-white w-full p-1"
              onClick={open_Review_Modal}>
              {booking_Detail.booking_Status === "completed" && booking_Detail.review === "" ? 'Review Your Stay' : 'See Review'}
            </button>
            }
            {/** 打開留言 Modal - 訂單狀態 Completed 才有Modal按鈕 */}

        </div>

        {/** 留言彈跳視窗 */}
          <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
            <div className="flex flex-col gap-4 px-4 pt-20 z-[999]">
              <p className="font-semibold">Hotel: {booking_Detail.hotel_Name}</p>
              <p>Name: {booking_Detail.traveler_Name}</p>

                {/* 訂單狀態 completed, 且尚未留言, 才可進行留言 */}
                {booking_Detail.booking_Status === "completed" && booking_Detail.review === "" && <>
                  <div className="flex gap-2" >
                  {[1,2,3,4,5].map((star: number) => {
                    return <FiveStarSVG name={"emptystar"} 
                      className="w-5 h-auto hover:fill-[#ffdd00]" key={star}
                      fill={star <= hover_Star ? '#ffdd00' : 'white'}
                      onMouseEnter={() => set_Hover_Star(star)}
                      >
                    </FiveStarSVG>
                    })}
                  </div>
                  <form onSubmit={submit_Review} className="flex flex-col gap-2">
                    <textarea name="review" id="review" rows={10} cols={50} className="border px-2"
                      placeholder="Leave comment for what you experience from this Hotel"
                      value={review}
                      onChange={(event) => handle_Change(event)}>
                    </textarea>
                    <button className="bg-primary rounded text-white self-center w-1/2 py-2"
                      >Submit
                    </button>

                  </form>
                </>
              }
              {/* 訂單狀態 completed, 且尚未留言, 才可進行留言 */}


              {/* 訂單狀態 completed, 但已留言, 僅能查看 */}
              {booking_Detail.booking_Status === "completed" && booking_Detail.review !== "" && <>
                <div className="flex gap-2" >
                {Array.from({length: booking_Detail.star_Rating ?? 0}, () => booking_Detail.star_Rating ?? 0).map((star: number, index) => {
                  return <OtherSVG name={"star"} 
                    className="w-5 h-auto hover:fill-[#ffdd00]" key={index}
                    // fill={star <= hover_Star ? '#ffdd00' : 'white'}
                    // onMouseEnter={() => set_Hover_Star(star)}
                    >
                  </OtherSVG>
                  })}
                </div>
                <textarea name="review" id="review" rows={10} cols={50} className="border px-2"
                placeholder="Leave comment for what you experience from this Hotel"
                value={review} readOnly>
                </textarea>
              </>
              }
               {/* 訂單狀態 completed, 但已留言, 僅能查看 */}
              {/** 5星評價 */}
              {/** 5星評價 */}
              
            </div>
          </Modal>
        {/** 留言彈跳視窗 */}
      {/** 留言評價 or 查看評價 */}
      </div>


      {/** 房型內部設施 */}
      <div className="hidden bg-white lg:flex justify-between rounded-lg p-2 gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Room Details</p>
            {/* <div className="flex flex-wrap"> */}
              <div className="basis-1/3 grid grid-cols-2 items-center gap-2">
                {booking_Detail.facility.map((facility, index) => {
                  return <div className="col-span-1 flex gap-1" key={index}>
                      <FacilitySVG name={facility} className="w-4 h-auto"></FacilitySVG>
                      <p>{facility.charAt(0).toUpperCase() + facility.slice(1)}</p>
                    </div>
                })}
              </div>
            {/* </div> */}
        </div>



       {/** 費用、稅率 */}
        <div className="hidden basis-1/2 lg:flex flex-col rounded-lg gap-2">
            <p className="text-sm font-semibold">Price Details</p>
            <div className="flex justify-between">
              <p className="text-sm text-gray">{`Room Price (${nights} nights)`}</p>
              <p>{`$ ${booking_Detail.price}`}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-sm text-gray">Offer Discount</p>
              <p>{((1 - offer_Discount)*100).toFixed()}% OFF</p>
            </div>

            <div className="flex justify-between">
              <p className="text-sm text-gray">Taxes and Fees</p>
              <p>{booking_Detail.price * booking_Detail.tax }</p>
            </div>

            <div className="flex justify-between">
              <p className="text-sm font-semibold">Total Charge</p>
              <p>{`$ ${(booking_Detail.price + (booking_Detail.price * booking_Detail.tax)) * offer_Discount}`}</p>
            </div>
          </div>
        {/** 費用、稅率 */}
      </div>
      {/** 房型內部設施 */}


        {/** 地圖 */}
        <div className="hidden bg-white lg:flex flex-col rounded-lg p-2 gap-2">
          <p className="text-sm font-semibold">Location</p>
          {/* <img src="/triplist/location.png" alt="" /> */}
          <MapContainer
            center={[booking_Detail?.latitude as number, booking_Detail?.longitude as number]} // 台北 101 位置
            zoom={13}
            style={{width: "100%", height: "20rem", borderRadius: "20px", zIndex: 0}}
            className="h-full">
            <TileLayer
            // 這裡使用 OpenStreetMap 免費圖資
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[booking_Detail?.latitude as number, booking_Detail?.longitude as number]}>
              <Tooltip permanent className="leaflet-tooltip ">{booking_Detail?.hotel_Name}</Tooltip>
            </Marker>
          </MapContainer>
          <p className="text-sm text-gray">{booking_Detail.address}</p>
          <button type="button" className="bg-primary text-white rounded py-2">Get Directions</button>
        </div>
        {/** 地圖 */}
    {/** PC桌機 */}




    </div>
    
    }
  </div>
}