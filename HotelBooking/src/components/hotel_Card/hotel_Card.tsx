import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { useEffect, useState } from "react";
import {FacilitySVG, HomeSVG, OtherSVG} from "../client_Svg/client_Svg";
import { Customer_Rating } from "../starrating/customer_Rating";
import Link from "next/link";
import Room_Type from "./hotel_Room_Type";
import { Review_Type_Interface } from "@/types/hotel_Detail";

// 1. props傳遞之 介面型別
interface Hotel_Card_Interface {
  the_Hotel: Hotel_Detail_Interface | undefined
};

// interface Review_Type_Interface {
//   id: string,
//   name: string,
//   date: string,
//   rating: number,
//   comment: string,
// }

// 2. Tab - 詳細、設施、評價陣列
const tab = ["Overview", "Rooms", "Facilities", "Review"]

export default function Hotel_Card ({the_Hotel}: Hotel_Card_Interface) {
  // 1. 父元件 HotelList props 指定飯店 之數據
  console.log(the_Hotel, "props傳遞");

  // 2. Tab - 數字對應 tab陣列索引值 之高亮切換
  const [selected_Tab, set_Selected_Tab] = useState(0);

  // 3. 低星、高星評論
  const [sorted_Review, set_Sorted_Review] = useState<Review_Type_Interface[]>([]);
  useEffect(() => {
    if(the_Hotel?.reviews) {
      const sorted = [...the_Hotel?.reviews].sort((a,b) => b.rating - a.rating);
      set_Sorted_Review(sorted);
    }
  },[the_Hotel])
  const rating_Arr = {...the_Hotel}
  const select_Rating = (rating_Value: string) => {
    if (!the_Hotel?.reviews) return;
    let sorted;
    switch (rating_Value) {
      case "lowRating":
        sorted =  [...the_Hotel?.reviews].sort((a,b) => a.rating - b.rating)
        break;
      case "highRating":
        sorted = [...the_Hotel?.reviews].sort((a,b) => b.rating - a.rating)
      default:
        sorted = [...the_Hotel?.reviews]
    }
    set_Sorted_Review(sorted as [])
  }
  

  
  return <div className="relative flex flex-col gap-2">
      {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}
      <div className="">
      <Swiper slidesPerView={1} 
        spaceBetween={5} 
        pagination={{clickable: true}} 
        modules={[Pagination]}>

        {the_Hotel?.images.map((img, index) => {
          return <SwiperSlide key={index}>
            <div className="relative">
              <img src={img.url} alt={img.description} className="w-full h-[230px] object-cover object-top"/>
              <p className="absolute bottom-2 right-8 text-white text-sm">
                { (index<10 ? "0"+(index+1): index+1) + "/" + (the_Hotel.images.length<10 ? "0" + the_Hotel.images.length : the_Hotel.images.length)}
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 absolute bottom-2 right-2 text-white">
                <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
              </svg>

            </div>
          </SwiperSlide>
        })}
      </Swiper>
    </div>
    {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}
    
    {/** 飯店名，吃Sticky，滾動固定Top */}
    <p className="font-bold px-4 bg-white sticky top-0 z-10">{the_Hotel?.name}</p>
    {/** 飯店名，吃Sticky，滾動固定Top */}

    {/* Tab 高亮切換，吃Sticky，滾動固定Top */}
      <ul className="flex gap-2 border-b border-softGray overflow-x-auto scrollbar-hidden bg-white sticky top-6 z-10 px-4 py-1">
        {tab.map((item, index) => {
          return <li key={index} onClick={() => set_Selected_Tab(index)} className="flex flex-col items-center cursor-pointer">
            <span className={`${selected_Tab === index ? 'text-primary' : ''} `}>{item}</span>
            {selected_Tab === index && <span className="text-primary mt-[-6px]">●</span>}
          </li>
        })}
      </ul>
    {/* Tab 高亮切換，吃Sticky，滾動固定Top */}



  <div className="flex flex-col p-4 gap-4 my-bg-gradient">

    {/* 飯店介紹 - 對照Tab高亮切換 */}
    {selected_Tab === 0 && <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        <OtherSVG name={"location"} className="w-5 h-auto"></OtherSVG>
        <p>{the_Hotel?.city + ", " + the_Hotel?.country}</p>
      </div>
      {/** 飯店地圖 */}
      <p className="text-primary font-semibold cursor-pointer">Shown On the Map</p>
      {/** 飯店地圖 */}
      <div className="flex gap-1">
        <HomeSVG name={"Star"} className="w-6 h-auto"></HomeSVG>
        <p className="bg-blue text-white font-semibold rounded px-2">{the_Hotel?.rating}</p>
        <p className="text-primary font-semibold">{"Reviews：" + the_Hotel?.reviews.length}</p>
      </div>
      {the_Hotel?.intro.map((details, index) => {
        return <p key={index}> {details} </p>
      })}
      <button className="bg-primary text-white rounded-lg p-2" onClick={() =>　set_Selected_Tab(1)}>Book Now</button>
    </div>
    }
    {/* 飯店介紹 - 對照Tab高亮切換 */}


    {/** 房型 */}
    <div>
      {selected_Tab === 1 && <Room_Type></Room_Type>}
    </div>
    {/** 房型 */}


    {/** 飯店設施 */}
      {selected_Tab === 2 && <div className="flex flex-col gap-2">

        <div className="flex flex-wrap gap-2">
          {the_Hotel?.facilities.map((facility, index) => {
            return <div key={index} className="flex flex-col items-center">
              <div className="bg-softGray rounded-[2rem]">
                <FacilitySVG name={facility} className="w-12 md:w-24 h-auto p-3"></FacilitySVG>
              </div>
              <p className="text-sm" key={index}> {facility.charAt(0).toUpperCase() + facility.slice(1)} </p>
            </div>
          })}
        </div>

        <button className="bg-primary text-white rounded-lg p-2" onClick={() =>　set_Selected_Tab(1)}>Book Now</button>
      </div>
      }
    {/** 飯店設施 */}
    

    {/** 飯店評論 */}
      {selected_Tab === 3 && 
        <div className=" mt-[-30px] flex flex-col gap-2">
          
          {/** 總平均評價 */}
          <div className="flex justify-between items-center py-2 border-b border-softGray">
            <div className="flex gap-2 items-center">
              <HomeSVG name={"Star"} className="w-6 h-auto"></HomeSVG>
              <p>{the_Hotel?.rating}</p>
              <p>{the_Hotel?.reviews.length + " Reviews"}</p>
            </div>
            {/** 排序評價 */}
              <select name="" id="" className="border-2 border-softGray p-1 rounded" onChange={(event) => select_Rating(event.target.value)}>
                <option value="hightRating">High</option>
                <option value="lowRating">Low</option>
              </select>
            {/** 排序評價 */}
          </div>
          {/** 總平均評價 */}

            {/** 留言、星星評價 */}
            {sorted_Review.map((item) => {
              return <div key={item.id}>
              <div className="flex justify-between">
                <p className="text-primary">{item.name} - {item.date}</p>
                <div className="flex">
                  <Customer_Rating rating={item.rating} className="w-4 h-auto"></Customer_Rating>
                </div>
              </div>
              <p className="py-2">{item.comment}</p>
              
            </div>
            })}
            {/** 留言、星星評價 */}
          
          <button className="bg-primary text-white rounded-lg p-2" onClick={() =>　set_Selected_Tab(1)}>Book Now</button>
      </div>
      }
    {/** 飯店評論 */}





    {/** 飯店價錢、跳轉付款頁面按鈕 */}
    {/* <div className="bg-white rounded-lg flex justify-between items-center py-2 px-3">
      <div className="flex">
        <span className="text-primary font-bold">{"$"+the_Hotel?.price + "/"} </span>
        <span className="text-gray"> night</span>
      </div>
      <Link href={"/payment"}>
        <button className="bg-primary text-white rounded-lg p-2">Book Now</button>
      </Link>

      <button className="bg-primary text-white rounded-lg p-2" onClick={() =>　set_Selected_Tab(1)}>Book Now</button>
    </div> */}
    {/** 飯店價錢、跳轉付款頁面按鈕 */}


  </div>
  </div>
}