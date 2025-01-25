import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
import { Hotel_Room_Type_Interface } from "@/types/hotel_Detail";
import { add_Hotel_Room_Type_Interface } from "@/types/add_Hotel_Detail";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';

// 1. props傳遞之 介面型別
interface Hotel_Card_Interface {
  redux_Booked_Room: add_Hotel_Room_Type_Interface
};

export default function Swiper_Hotel_Detail({redux_Booked_Room}: Hotel_Card_Interface) {


  return <>
    {/* Swiper 飯店圖片 - <Swiper>外層一定要有<div> */}
    <div className="p-4">
      <Swiper slidesPerView={1}
        spaceBetween={5}
        pagination={{ clickable: true }}
        modules={[Pagination]}>

        {redux_Booked_Room?.roomType_Image_List.map((img, index) => {
          return <SwiperSlide key={index}>
            <div className="relative">
              <img src={img.url} alt={img.description} className="w-full h-[230px] object-cover object-top rounded-t-3xl" />
              <p className="absolute bottom-2 right-8 text-white text-sm">
                {(index < 10 ? "0" + (index + 1) : index + 1) + "/" + (redux_Booked_Room.roomType_Image_List.length < 10 ? "0" + redux_Booked_Room.roomType_Image_List.length : redux_Booked_Room.roomType_Image_List.length)}
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
  </>
}