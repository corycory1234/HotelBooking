import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import how_Many_Nights from "@/utils/how_Many_Nights";
import { OtherSVG } from "../client_Svg/client_Svg";
import Link from "next/link";

export default function Room_Type() {
  // 1. Redux - 飯店明細
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);
  const redux_Hotel_Room_Type = redux_Hotel_Detail.roomType;
  console.log(redux_Hotel_Room_Type, "房型數據");

  // 2. 住幾晚
  const redux_Fomr_Search = useSelector((state: RootState) => state.formSearch); // Redux - 搜尋參數
  const nights = how_Many_Nights(redux_Fomr_Search.dateRange?.slice(0,10), redux_Fomr_Search.dateRange?.slice(13))

  return <>
    <div className="flex flex-col gap-4">
      {redux_Hotel_Room_Type.map((room) => {
        return <div key={room.id} className="flex flex-col gap-2">
        
        {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}
        <div className="">
          <Swiper slidesPerView={1}
            spaceBetween={5}
            pagination={{ clickable: true }}
            modules={[Pagination]}>
  
            {room?.images.map((img, index) => {
              return <SwiperSlide key={index}>
                <div className="relative">
                  <img src={img.url} alt={img.description} className="w-full h-[230px] object-cover object-top rounded-lg" />
                  <p className="absolute bottom-2 right-8 text-white text-sm">
                    {(index < 10 ? "0" + (index + 1) : index + 1) + "/" + (room.images.length < 10 ? "0" + room.images.length : room.images.length)}
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 absolute bottom-2 right-2 text-white">
                    <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                  </svg>

                  {/** 剩3間警示 */}
                  {room.availability <=3 && 
                    <p className="absolute top-2 left-2 text-customRed bg-red-50 font-bold px-2 rounded">{"Only " + room.availability + " Left"}</p>
                  }
                  {/** 剩3間警示 */}
                  
                </div>
              </SwiperSlide>
            })}
          </Swiper>
        </div>
        {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}

        
        {/** 房型名稱、房間大小、最多幾人住 */}
        <p className="font-bold">{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</p>
        <div className="flex gap-1">
          <OtherSVG name={"roomsize"} className="w-4 h-auto"></OtherSVG>
          <p>{room.roomsize + "㎡"}</p>
          <OtherSVG name={"maxoccupancy"} className="w-4 h-auto"></OtherSVG>
          <p>{"Max " + room.maxOccupancy + " People"}</p>
        </div>
        {/** 房型名稱、房間大小、最多幾人住 */}



        <div className="flex flex-col p-2 border border-gray rounded gap-2">
          
          {/** 房間裡的SVG */}
          <div className="flex gap-2 flex-wrap">
            {/** 禁菸房 | 吸菸房 */}
            {room.smoke ? 
            <div className="flex gap-1 bg-softGray rounded p-1">
              <OtherSVG name={"smoking"} className="w-4 h-auto"/>
              <span className="text-xs">Smoking Room</span>
            </div>
            : 
            <div className="flex gap-1 bg-softGray rounded p-1">
              <OtherSVG name={"nosmoking"} className="w-4 h-auto"></OtherSVG>
              <span className="text-xs">No-Smoking Room</span>
            </div>
            }
            {/** 禁菸房 | 吸菸房 */}

            {/** 房間裡的設施 */}
            {room.amenity.map((item, index) => {
              return <div className="flex gap-1 bg-softGray rounded p-1" key={index}>
                <OtherSVG name={item} className="w-4 h-auto"/> 
                <span className="text-xs">{item}</span>
              </div>
            })}
            {/** 房間裡的設施 */}

          </div>
          {/** 房間裡的SVG */}
          
          {/** 房型價錢、住幾晚、人數 */}
          {/* <div className="flex flex-col">
            <p className="font-bold text-lg">{room.price}</p>
            <p className="text-gray text-sm">
              {nights + " Nights"} | {redux_Fomr_Search.adult + " Adults"} {redux_Fomr_Search.child ? "|" + redux_Fomr_Search.child + " Childs" : ""}
              </p>
          </div> */}
          {/** 房型價錢、住幾晚、人數 */}


          {/** Book按鈕 */}
          <div className="flex justify-between items-end">
            {/* <p className={`basis-1/2 ${room.availability <=3 ? 'text-customRed' : 'text-primary'}`}>{room.availability + " Rooms Left"}</p> */}

            {/** 房型價錢、住幾晚、人數 */}
            <div className="flex flex-col">
              <p className="font-bold text-lg">{room.price}</p>
              <p className="text-gray text-sm">
                {nights + " Nights"} | {redux_Fomr_Search.adult + redux_Fomr_Search.child + " Travelers"} 
                {/* {redux_Fomr_Search.child ? "|" + redux_Fomr_Search.child + " Childs" : ""} */}
                </p>
            </div>
            {/** 房型價錢、住幾晚、人數 */}

            {/** 跳轉 Payment */}
            <Link href={"/payment"}>
              <button className="bg-primary p-2 rounded text-white">Book Now</button>
            </Link>
            {/** 跳轉 Payment */}
          </div>
          {/** Book按鈕 */}

        </div>



        
        
        </div>
      })}

    </div>
  </>
}