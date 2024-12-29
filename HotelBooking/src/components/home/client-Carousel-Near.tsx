'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import StarRating from "@/components/starrating/star-Rating";

export default function CarouselNear() {
  const swiperImg = [
    {
      url: '/home/Near_1.png',
      hotelName: 'Pan Pacific Hotel',
      price: 1200,
      ranking: 5,
    },
    {
      url: '/home/Near_2.png',
      hotelName: 'Prestige Proga Inn',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/Near_1.png',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
  ]



  return <>
    <Swiper slidesPerView={2} spaceBetween={10}>

        {swiperImg.map((item, index) =>
          <SwiperSlide key={index} className="flex-col">
            <img className="w-full h-full relative" src={item.url} alt="" />
            <div className="absolute top-2 right-2 w-[16px] h-[16px] bg-white rounded-full flex justify-center items-center">
              <img className="" src="/home/Bookmark.svg" alt="" />
            </div>
            <div className="flex flex-col gap-1 p-2">
              <h2 className="text-xs">{item.hotelName}</h2>
              <div className="flex justify-between">
                <StarRating ranking={item.ranking}></StarRating>
                <p className="text-xs text-primary font-semibold">
                  {'$' + item.price + '/'} 
                  <span className="text-xs text-soft-gray">night</span>
                  </p>
              </div>

            </div>
          </SwiperSlide>
        )}


    </Swiper>
  </>
}