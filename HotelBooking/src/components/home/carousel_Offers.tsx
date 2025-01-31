'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import Offer_List_Json from "@/fakeData/offer_List.json";
import { useRouter } from "next/navigation";

export default function Carousel_Offer() {
  // 1. 路遊
  const router = useRouter();

  // 2. 點擊輪播圖 - 傳遞 offer_Id 參數
  const check_Offer = (offer_Id: string) => {
    router.push(`/offers/${offer_Id}`);
  };

  return <>
    <Swiper slidesPerView={2.7} spaceBetween={20}
      modules={[Navigation]}
      navigation={true}
      breakpoints={{
        1024: {slidesPerView: 4}
      }}
    >
      <div className="flex">
        {Offer_List_Json.map((item, index) =>
          <SwiperSlide key={index}>
            <img className="w-full h-[100px] lg:h-[174.56px] object-cover rounded cursor-pointer" src={item.offer_Url} alt={item.offer_Description} 
            onClick={() => check_Offer(item.offer_Id)}/>
            <p className="text-center pt-2">{item.offer_Description}</p>
          </SwiperSlide>
        )}
      </div>

    </Swiper>
  </>
}