import { useSelector, useDispatch } from "react-redux";
import { update_Booked_Room } from "@/store/booked_Room/booked_Room";
import { RootState } from "@/store/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import how_Many_Nights from "@/utils/how_Many_Nights";
import { OtherSVG } from "../client_Svg/client_Svg";
import Link from "next/link";
import { Hotel_Room_Type_Interface } from "@/types/hotel_Detail";
import { add_Hotel_Room_Type_Interface } from "@/types/add_Hotel_Detail";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../modal/modal";
import Full_Modal from "../modal/full-modal";
import { useTranslations } from "next-intl";

export default function Hotel_Room_Type() {
  // 1. Redux - 飯店明細
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);
  const redux_Hotel_Room_Type = redux_Hotel_Detail.roomType_List;
  console.log(redux_Hotel_Room_Type, "房型數據");
  
  // 2. 住幾晚
  const redux_Fomr_Search = useSelector((state: RootState) => state.formSearch); // Redux - 搜尋參數
  const nights = how_Many_Nights(redux_Fomr_Search.dateRange?.slice(0,10), redux_Fomr_Search.dateRange?.slice(13))
  
  // 3. Book Now按鈕，傳遞ID，透過find拉出房型，存入Redux
  const router = useRouter();
  const dispatch = useDispatch();
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  const book_Room = async (id: string) => {
    const the_Booked_Room = redux_Hotel_Room_Type.find((item) => item.roomType_Id === id);
    const result = dispatch(update_Booked_Room(the_Booked_Room as add_Hotel_Room_Type_Interface))
    console.log(redux_Booked_Room, "Redux - 被訂房間初始值");
    console.log(result, "結果");
    if(result) {
      router.push("/travelerinfo")
    } else {
      alert("訂房失敗")
    }
  };

  // 4. 透過Swiper, 打開「房型照片彈窗」
  const [modal_Boolean_Swiper_RoomType, set_Modal_Boolean_Swiper_RoomType] = useState<boolean>(false);

  // 5. 打開滿版彈窗
  const [full_Modal_Boolean, set_Full_Modal_Boolean] = useState<boolean>(false);
  const [the_Slide, set_The_Silde] = useState<number>(0);
  const show_The_Full_Slide = (index: number) =>{
    set_The_Silde(index);
    set_Full_Modal_Boolean(true);
  };

  // 6. next-intl i18n翻譯
  const t = useTranslations("HotelCard");
  


  return <>
    <div className="flex flex-col gap-4">
      {redux_Hotel_Room_Type?.map((room, index) => {
        return <div key={index} className="flex flex-col gap-2">
        
        {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}
        <div className="">
          <Swiper slidesPerView={1}
            spaceBetween={5}
            pagination={{ clickable: true }}
            modules={[Pagination]}>
  
            {room?.roomType_Image_List?.map((img, index) => {
              return <SwiperSlide key={index} onClick={() => set_Modal_Boolean_Swiper_RoomType(true)}>
                <div className="relative">
                  <img src={img.url} alt={img.description} className="w-full h-[230px] object-cover rounded-lg cursor-pointer" />
                  <p className="absolute bottom-2 right-8 text-white text-sm">
                    {(index < 10 ? "0" + (index + 1) : index + 1) + "/" + (room.roomType_Image_List.length < 10 ? "0" + room.roomType_Image_List.length : room.roomType_Image_List.length)}
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 absolute bottom-2 right-2 text-white">
                    <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                  </svg>

                  {/** 剩3間警示 */}
                  {(room.room_Availability as number) <=3 && 
                    <p className="absolute top-2 left-2 text-customRed bg-red-50 font-bold px-2 rounded">{"Only " + room.room_Availability + " Left"}</p>
                  }
                  {/** 剩3間警示 */}
                  
                </div>
              </SwiperSlide>
            })}
          </Swiper>

        {/** 飯店照片 - 彈跳視窗 */}
        <Modal isOpen={modal_Boolean_Swiper_RoomType} onClose={() => set_Modal_Boolean_Swiper_RoomType(false)}>
          <div className="flex flex-col gap-2 pt-4">
            <p className="text-primary font-semibold text-center">Hotel Pictures</p>
            <div className="flex flex-wrap p-2  justify-between">
              {room?.roomType_Image_List?.map((item, index) => {
                return <img src={item.url} alt={item.description} key={item.description}
                  className={`${(index ===0 || index %3 === 0 ? 'w-full' : 'w-1/2')} p-1 rounded-lg object-cover cursor-pointer`}
                  onClick={() => show_The_Full_Slide(index)}/>
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

            {room?.roomType_Image_List?.map((img, index) => {
              return <SwiperSlide key={index} className="flex items-center justify-center">
                <div className="relative flex justify-center items-center">
                  <img src={img.url} alt={img.description} className="w-full h-[50vh] object-cover"/>
                  <p className="absolute bottom-2 right-8 text-white text-sm">
                    { (index<10 ? "0"+(index+1): index+1) + "/" + (room?.roomType_Image_List?.length<10 ? "0" + room?.roomType_Image_List?.length : room?.roomType_Image_List?.length)}
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

        
        {/** 房型名稱、房間大小、最多幾人住 */}
        <div className="flex gap-1">
          <p className="font-bold">{t (room.room_Type)}</p>
          <p className="font-bold">- {t (room.bed_Type)}</p>
        </div>
        <div className="flex gap-1">
          <OtherSVG name={"roomsize"} className="w-4 h-auto"></OtherSVG>
          <p>{room.room_Size + t ("m²")}</p>
          <OtherSVG name={"maxoccupancy"} className="w-4 h-auto"></OtherSVG>
          <p>{t ("Max") + room.max_People + t ("Adults")}</p>
        </div>
        {/** 房型名稱、房間大小、最多幾人住 */}



        <div className="flex flex-col p-2 border border-gray rounded gap-2">
          
          {/** 房間裡的SVG */}
          <div className="flex gap-2 flex-wrap">
            {/** 禁菸房 | 吸菸房 */}
            {room.smoke === true ? 
            <div className="flex gap-1 bg-softGray rounded p-1">
              <OtherSVG name={"smoking"} className="w-4 h-auto"/>
              <span className="text-xs">{t ("Smoking Room")}</span>
            </div>
            : 
            <div className="flex gap-1 bg-softGray rounded p-1">
              <OtherSVG name={"nosmoking"} className="w-4 h-auto"></OtherSVG>
              <span className="text-xs">{t ("No Smoking")}</span>
            </div>
            }
            {/** 禁菸房 | 吸菸房 */}

            {/** 房間裡的設施 */}
            {room.amenity_List?.map((item, index) => {
              return <div className="flex gap-1 bg-softGray rounded p-1" key={index}>
                <OtherSVG name={item} className="w-4 h-auto"/> 
                <span className="text-xs">{t (item)}</span>
              </div>
            })}
            {/** 房間裡的設施 */}

          </div>
          {/** 房間裡的SVG */}
          

          {/** Book按鈕 */}
          <div className="flex justify-between items-end">
            {/* <p className={`basis-1/2 ${room.availability <=3 ? 'text-customRed' : 'text-primary'}`}>{room.availability + " Rooms Left"}</p> */}

            {/** 房型價錢、住幾晚、人數 */}
            <div className="flex flex-col">
              <p className="font-bold text-lg">{room.room_Price}</p>
              <p className="text-gray text-sm">
                {nights + t ("Nights")} | {redux_Fomr_Search.adult + redux_Fomr_Search.child + t("Guests")} 
                {/* {redux_Fomr_Search.child ? "|" + redux_Fomr_Search.child + " Childs" : ""} */}
                </p>
            </div>
            {/** 房型價錢、住幾晚、人數 */}

            {/** 跳轉 Payment */}
            {/* <Link href={"/payment"}> */}
              <button className="bg-primary p-2 rounded text-white"
                onClick={() => book_Room(room.roomType_Id)}>{t ("Book Now")}</button>
            {/* </Link> */}
            {/** 跳轉 Payment */}
          </div>
          {/** Book按鈕 */}

        </div>



        
        
        </div>
      })}

    </div>
  </>
}