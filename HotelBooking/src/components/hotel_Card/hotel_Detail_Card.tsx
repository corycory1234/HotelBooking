'use client';  
import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useEffect, useState } from "react";
import { HomeSVG, OtherSVG } from "../client_Svg/client_Svg";
import Hotel_Room_Type from "./hotel_Room_Type";
import Hotel_Facility from "./hotel_Facility";
import Hotel_Customer_Review from "./hotel_Customer_Review";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { LatLngExpression } from "leaflet"; // 從 @types/leaflet 來的
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Modal from "@/components/modal/modal";
import Full_Modal from "../modal/full-modal";
import { useSearchParams } from "next/navigation";

// 1. props傳遞之 介面型別
interface Hotel_Card_Interface {
  the_Hotel: add_Hotel_Detail_Interface | undefined
};

// 2. Tab - 詳細、設施、評價陣列
const tab = ["Overview", "Rooms", "Review", "Information"];

// 3. leaflet 打開地圖彈窗, 所需要的大頭針之圖檔
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

export default function Hotel_Detail_Card ({the_Hotel}: Hotel_Card_Interface) {
  // 1. 拿 timeStamp - URL時間戳
  const searchParams = useSearchParams();

  // 2. 父元件 HotelList props 指定飯店 之數據
  console.log(the_Hotel, "props傳遞");

  // 4. Tab - 數字對應 tab陣列索引值 之高亮切換
  const [selected_Tab, set_Selected_Tab] = useState(0);

  // 5. Modal彈窗 - 布林
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false);

  // 6. Skeleton動畫 - 延遲2秒 (這邊待API寫好, 於useEffect)
  const [show_Hotel_Detail_Card, set_Show_Hotel_Detail_Card] = useState<boolean>(false);
  useEffect(() => {
    set_Show_Hotel_Detail_Card(false);
    const timer = setTimeout(() => {
      set_Show_Hotel_Detail_Card(true);
    },2000);
    return () => clearTimeout(timer);
  },[searchParams.get('timestamp')])

  // 6. Skeleton動畫 - 佔位符
  const Placeholder_Card = () => {
    return <div className="flex flex-col gap-2 p-2">
      <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
      <h3 className="animate-pulse bg-softGray w-full h-6 rounded"></h3>
      <div className="flex gap-2">
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
      </div>

      <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
      <h3 className="animate-pulse bg-softGray w-full h-6 rounded"></h3>
      <div className="flex gap-2">
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
      </div>

      <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
      <h3 className="animate-pulse bg-softGray w-full h-6 rounded"></h3>
      <div className="flex gap-2">
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
        <h3 className="animate-pulse bg-softGray w-1/4 h-6 rounded"></h3>
      </div>
    </div>
  };

  // 7. 透過Swiper, 打開「飯店照片彈窗」
  const [modal_Boolean_Swiper, set_Modal_Boolean_Swiper] = useState<boolean>(false);

  // 8. 打開滿版彈窗
  const [full_Modal_Boolean, set_Full_Modal_Boolean] = useState<boolean>(false);
  const [the_Slide, set_The_Silde] = useState<number>(0);
  const show = (index: number) =>{
    set_The_Silde(index);
    set_Full_Modal_Boolean(true);
  }

  return <>
  {!show_Hotel_Detail_Card ? <Placeholder_Card></Placeholder_Card> 
  
  :
  <div className="relative">
    <div className="relative flex flex-col gap-2">
        {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}
        <div className="">
        <Swiper slidesPerView={1} 
          spaceBetween={5} 
          pagination={{clickable: true}} 
          modules={[Pagination]}
          >

          {the_Hotel?.hotel_Image_List.map((img, index) => {
            return <SwiperSlide key={index} className="cursor-pointer" onClick={() => set_Modal_Boolean_Swiper(true)}>
              <div className="relative">
                <img src={img.url} alt={img.description} className="w-full h-[230px] object-cover object-top"/>
                <p className="absolute bottom-2 right-8 text-white text-sm">
                  { (index<10 ? "0"+(index+1): index+1) + "/" + (the_Hotel.hotel_Image_List.length<10 ? "0" + the_Hotel.hotel_Image_List.length : the_Hotel.hotel_Image_List.length)}
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 absolute bottom-2 right-2 text-white">
                  <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                </svg>

              </div>
            </SwiperSlide>
          })}
        </Swiper>

        {/** 飯店照片 - 彈跳視窗 */}
        <Modal isOpen={modal_Boolean_Swiper} onClose={() => set_Modal_Boolean_Swiper(false)}>
          <div className="flex flex-col gap-2 pt-4">
            <p className="text-primary font-semibold text-center">Hotel Pictures</p>
            <div className="flex flex-wrap p-2  justify-between">
              {the_Hotel?.hotel_Image_List.map((item, index) => {
                return <img src={item.url} alt={item.description} key={item.description}
                  className={`${(index ===0 || index %3 === 0 ? 'w-full' : 'w-1/2')} p-1 rounded-lg object-cover cursor-pointer`}
                  onClick={() => show(index)}/>
              })}
            </div>
          </div>
        </Modal>
        {/** 飯店照片 - 彈跳視窗 */}
        

        {/** 飯店照片 - 看滿版照片 - 彈跳視窗 */}
        <Full_Modal isOpen={full_Modal_Boolean} onClose={() => set_Full_Modal_Boolean(false)}>
          <Swiper slidesPerView={1} 
            spaceBetween={5} 
            pagination={{clickable: true}} 
            modules={[Pagination, Navigation]}
            // navigation
            initialSlide={the_Slide}
            className="w-full h-full">

            {the_Hotel?.hotel_Image_List.map((img, index) => {
              return <SwiperSlide key={index} className="flex items-center justify-center">
                <div className="relative flex justify-center items-center">
                  <img src={img.url} alt={img.description} className="w-full h-[50vh] object-cover"/>
                  <p className="absolute bottom-2 right-8 text-white text-sm">
                    { (index<10 ? "0"+(index+1): index+1) + "/" + (the_Hotel.hotel_Image_List.length<10 ? "0" + the_Hotel.hotel_Image_List.length : the_Hotel.hotel_Image_List.length)}
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 absolute bottom-2 right-2 text-white">
                    <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                  </svg>

                </div>
              </SwiperSlide>
            })}
          </Swiper>
        </Full_Modal>
        {/** 飯店照片 - 看滿版照片 - 彈跳視窗 */}
      </div>
      {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}




      {/** 飯店名，吃Sticky，滾動固定Top */}
      <p className="font-bold px-4 bg-white sticky top-0 z-10">{the_Hotel?.hotel_Name}</p>
      {/** 飯店名，吃Sticky，滾動固定Top */}

      {/* Tab 高亮切換，吃Sticky，滾動固定Top */}
        <ul className="flex gap-2 border-b border-softGray overflow-x-auto scrollbar-hidden bg-white sticky top-6 z-10 px-4 py-1">
          {tab.map((item, index) => {
            return <li key={index} onClick={() => set_Selected_Tab(index)} className="w-1/4  flex-shrink-0 flex flex-col items-center cursor-pointer">
              <span className={`${selected_Tab === index ? 'text-primary' : ''} `}>{item}</span>
              {selected_Tab === index && <span className="text-primary mt-[-6px]">●</span>}
            </li>
          })}
        </ul>
      {/* Tab 高亮切換，吃Sticky，滾動固定Top */}
      </div>


    <div className="flex flex-col p-4 my-bg-gradient">

      {/* 飯店介紹 - 對照Tab高亮切換 */}
      {selected_Tab === 0 && <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <OtherSVG name={"location"} className="w-5 h-auto"></OtherSVG>
          <p>{the_Hotel?.city + ", " + the_Hotel?.country}</p>
        </div>


        <p className="text-primary font-semibold cursor-pointer" onClick={() => set_Modal_Boolean(true)}>Shown On the Map</p>
        
      {/** React - leaflet 地圖 */}
        <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
          <MapContainer
            center={[the_Hotel?.latitude as number, the_Hotel?.longtitude as number]} // 台北 101 位置
            zoom={13}
            style={{width: "100%" }}
            className="h-full">
            <TileLayer
            // 這裡使用 OpenStreetMap 免費圖資
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[the_Hotel?.latitude as number, the_Hotel?.longtitude as number]}>
              <Tooltip permanent className="leaflet-tooltip ">{the_Hotel?.hotel_Name}</Tooltip>
            </Marker>
          </MapContainer>
        </Modal>
      {/** React - leaflet 地圖 */}


        <div className="flex gap-1">
          <HomeSVG name={"Star"} className="w-6 h-auto"></HomeSVG>
          <p className="bg-blue text-white font-semibold rounded px-2">{the_Hotel?.totalRating}</p>
          <p className="text-primary font-semibold">{"Reviews：" + the_Hotel?.review_List.length}</p>
        </div>
        {/* {the_Hotel?.intro.map((details, index) => {
          return <p key={index}> {the_Hotel.hotel_Intro} </p>
        })} */}
        <p> {the_Hotel?.hotel_Intro} </p>
        <div className="border-b border-softGray"></div>
        <Hotel_Facility></Hotel_Facility>

          {/** 跳轉房型按鈕 */}
          <div className="bg-white py-2 rounded border-t border-softGray sticky bottom-0 z-10">
            <button className="bg-primary text-white rounded-lg py-2 w-full" 
              onClick={() =>　set_Selected_Tab(1)}>Book Now
            </button>
          </div>
          {/** 跳轉房型按鈕 */}
        {/* <button className="bg-primary text-white rounded-lg p-2 sticky bottom-0 z-[9999]" onClick={() =>　set_Selected_Tab(1)}>Book Now</button> */}
      </div>
      }
      {/* 飯店介紹 - 對照Tab高亮切換 */}


      {/** 房型 */}
      <div>
        {selected_Tab === 1 && <Hotel_Room_Type></Hotel_Room_Type>}
      </div>
      {/** 房型 */}


      {/** 飯店設施 */}
        {/* {selected_Tab === 2 && <div className="flex flex-col gap-2">
          <Hotel_Facility></Hotel_Facility>
          <button className="bg-primary text-white rounded-lg p-2" onClick={() =>　set_Selected_Tab(1)}>Book Now</button>
        </div>
        } */}
      {/** 飯店設施 */}
      

      {/** 飯店評論 */}
        {selected_Tab === 2 &&
        <div className=" flex flex-col gap-2">
          <Hotel_Customer_Review></Hotel_Customer_Review>

          {/** 跳轉房型按鈕 */}
          <div className="bg-white rounded py-2 border-t border-softGray sticky bottom-0 z-[9999]">
            <button className="bg-primary text-white rounded-lg py-2 w-full" 
              onClick={() =>　set_Selected_Tab(1)}>Book Now
            </button>
          </div>
          {/** 跳轉房型按鈕 */}
          {/* <button className="bg-primary text-white rounded-lg p-2 sticky bottom-0 z-[9999]" onClick={() => set_Selected_Tab(1)}>Book Now</button> */}
        </div>
        }
      {/** 飯店評論 */}
      

      {/** 基本資訊 */}
        {selected_Tab === 3 && 
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Address／Transportation</p>
          {/** 飯店經緯度 - GoogleMap */}
          <div className="flex items-center gap-2">
            <OtherSVG name="marker" className="w-10 h-auto"></OtherSVG>
            <a target="_blank" href={`https://www.google.com/maps?q=${the_Hotel?.latitude},${the_Hotel?.longtitude}`}
              rel="noopener noreferrer" className="customized-underline text-primary">
              {the_Hotel?.address}
            </a>
          </div>
          {/** 飯店經緯度 - GoogleMap */}
          
          <div className="flex items-center gap-2">
            <OtherSVG name="transportation" className="w-6 h-auto"></OtherSVG>
            <p className="text-sm font-semibold">{the_Hotel?.transportation}</p>
          </div>

          {/** React-leaflet 地圖 */}
            <MapContainer
              center={[the_Hotel?.latitude as number, the_Hotel?.longtitude as number]} // 台北 101 位置
              zoom={15}
              style={{width: "100%", height: "20rem", borderRadius: "20px"}}>
              <TileLayer
              // 這裡使用 OpenStreetMap 免費圖資
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <Marker position={[the_Hotel?.latitude as number, the_Hotel?.longtitude as number]}>
                <Tooltip permanent className="leaflet-tooltip ">{the_Hotel?.hotel_Name}</Tooltip>
              </Marker>
              </MapContainer>
          {/** React-leaflet 地圖 */}

        {/** 住宿資訊 */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Accommodation Info</p>
          <div className="flex">
            <div className="w-1/2 flex flex-col">
              <p>Check-In</p>
              <p className="font-semibold">{the_Hotel?.checkin}</p>
            </div>
            <div className="w-1/2 flex flex-col">
              <p>Check-Out</p>
              <p className="font-semibold">{the_Hotel?.checkout}</p>
            </div>
          </div>

          {/** 付款資訊 */}
          <p className="text-sm font-semibold">Payment</p>
          <div className="flex flex-wrap">
            <div className="basis-1/2 flex gap-2">
              <OtherSVG name="master" className="w-4 h-auto"></OtherSVG>
              <p>Master Card</p>
            </div>
            <div className="basis-1/2 flex gap-2">
              <OtherSVG name="visa" className="w-4 h-auto"></OtherSVG>
              <p>Visa Card</p>
            </div>
            <div className="basis-1/2 flex gap-2">
              <OtherSVG name="jcb" className="w-4 h-auto"></OtherSVG>
              <p>JCB Card</p>
            </div>
          </div>
          {/** 付款資訊 */}

          {/** 電話、郵件 */}
          <div className="flex flex-col">
            <div className="flex">
              <p className="basis-1/2">TEL</p>
              <p className="basis-1/2">{the_Hotel?.hotel_Phone}</p>
            </div>
            <div className="flex">
              <p className="basis-1/2">Email</p>
              <p className="basis-1/2">{the_Hotel?.hotel_Email}</p>
            </div>
          </div>
          {/** 電話、郵件 */}
        </div>
        {/** 住宿資訊 */}
        

        {/** 取消政策 */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Cancellation Policy</p>
          {the_Hotel?.cancellation_Policy?.split(".").map((item) => {
            return <div className="flex flex-col gap-2" key={item}>
                <p>{item}</p>
            </div>
          })}
        </div>
        {/** 取消政策 */}

        {/** 推薦景點 */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Top Recommendations</p>
          {the_Hotel?.recommendation?.split(", ").map((recommendation) => {
            return <div className="flex" key={recommendation}> {recommendation}</div>
          })}
        </div>
        {/** 推薦景點 */}


          {/** 跳轉房型按鈕 */}
          <div className="bg-white rounded py-2 border-t border-softGray sticky bottom-0 z-[9999]">
            <button className="bg-primary text-white rounded-lg py-2 w-full" 
              onClick={() =>　set_Selected_Tab(1)}>Book Now
            </button>
          </div>
          {/** 跳轉房型按鈕 */}

        </div>

        }
        {/** 基本資訊 */}

    </div>

  </div>
  
  }
</> 
}