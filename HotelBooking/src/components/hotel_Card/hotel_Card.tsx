import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { useState } from "react";
import {FacilitySVG, HomeSVG} from "../client_Svg/client_Svg";
import { Customer_Rating } from "../starrating/customer_Rating";
import Link from "next/link";
import Room_Type from "./hotel_Room_Type";

// 1. props傳遞之 介面型別
interface Hotel_Card_Interface {
  the_Hotel: Hotel_Detail_Interface | undefined
};

// 2. Tab - 詳細、設施、評價陣列
const tab = ["Details", "Rooms", "Facilities", "Review"]

export default function Hotel_Card ({the_Hotel}: Hotel_Card_Interface) {
  // 1. 父元件 HotelList props 指定飯店 之數據
  console.log(the_Hotel, "props傳遞");

  // 2. Tab - 數字對應 tab陣列索引值 之高亮切換
  const [selected_Tab, set_Selected_Tab] = useState(0);
  
  return <>
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
  <div className="flex flex-col p-4 gap-4 my-bg-gradient ">

    <p className="font-bold">{the_Hotel?.name}</p>

    {/* Tab 高亮切換 */}
    {/* <div className="flex overflow-x-auto scrollbar-hidden"> */}
      <ul className="flex gap-2 border-b border-softGray overflow-x-auto scrollbar-hidden">
        {tab.map((item, index) => {
          return <li key={index} onClick={() => set_Selected_Tab(index)} className="flex flex-col items-center cursor-pointer">
            <span className={`${selected_Tab === index ? 'text-primary' : ''} `}>{item}</span>
            {selected_Tab === index && <span className="text-primary mt-[-6px]">●</span>}
          </li>
        })}
      </ul>
      {/* <p className="flex flex-col items-center text-blue cursor-pointer">Directions
        <span className="text-blue mt-[-6px]">○</span>
      </p> */}
    {/* </div> */}
    {/* Tab 高亮切換 */}
    
    {/* 飯店介紹 - 對照Tab高亮切換 */}
    {selected_Tab === 0 && the_Hotel?.intro.map((details, index) => {
      return <p key={index}> {details} </p>
    })}
    {/* 飯店介紹 - 對照Tab高亮切換 */}


    {/** 房型 */}
    <div>
      {selected_Tab === 1 && <Room_Type></Room_Type>}
    </div>
    {/** 房型 */}


    {/** 飯店設施 */}
    <div className="flex flex-wrap gap-2">
      {selected_Tab === 2 && the_Hotel?.facilities.map((facility, index) => {

        return <div key={index} className="flex flex-col items-center">
          <div className="bg-softGray rounded-[2rem]">
            <FacilitySVG name={facility} className="w-12 md:w-24 h-auto p-3"></FacilitySVG>
          </div>
          <p className="text-sm" key={index}> {facility.charAt(0).toUpperCase() + facility.slice(1)} </p>
        </div>
      })}
    </div>
    {/** 飯店設施 */}
    

    {/** 飯店評論 */}
      {selected_Tab === 3 && 
        <div className=" mt-[-30px] flex flex-col gap-2">
          
          {/** 總平均評價 */}
          <div className="flex gap-2 border-b border-softGray py-2">
            <HomeSVG name={"Star"} className="w-6 h-auto"></HomeSVG>
            <p>{the_Hotel?.rating}</p>
            <p>{the_Hotel?.reviews.length + " Reviews"}</p>
          </div>
          {/** 總平均評價 */}

            {/** 留言、星星評價 */}
            {the_Hotel?.reviews.map((item) => {
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
        
      </div>
      }
    {/** 飯店評論 */}





    {/** 飯店價錢、跳轉付款頁面按鈕 */}
    <div className="bg-white rounded-lg flex justify-between items-center py-2 px-3">
      <div className="flex">
        <span className="text-primary font-bold">{"$"+the_Hotel?.price + "/"} </span>
        <span className="text-gray"> night</span>
      </div>
      <Link href={"/payment"}>
        <button className="bg-primary text-white rounded-lg p-2">Book Now</button>
      </Link>
    </div>
    {/** 飯店價錢、跳轉付款頁面按鈕 */}


  </div>
  </>
}