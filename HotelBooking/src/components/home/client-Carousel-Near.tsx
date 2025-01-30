'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import StarRating from "../starrating/star-Rating";

export default function CarouselNear() {
  const swiperImg = [
    {
      url: '/home/near_1.webp',
      hotelName: 'Pan Pacific Hotel',
      price: 1200,
      ranking: 5,
    },
    {
      url: '/home/near_2.webp',
      hotelName: 'Prestige Proga Inn',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/near_3.webp',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/near_4.webp',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/near_5.webp',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/near_6.webp',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/near_7.webp',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/near_8.webp',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
    {
      url: '/home/near_9.webp',
      hotelName: 'Bangkok Hotel',
      price: 1200,
      ranking: 3,
    },
  ]



  return <>
    <Swiper slidesPerView={2} spaceBetween={20}
      modules={[Navigation]}
      navigation={true}
      breakpoints={{
        1024: {slidesPerView: 5.2}
      }}>
        <div className="flex">
        {swiperImg.map((item, index) =>
          <SwiperSlide key={index} className="flex-col">
            <img className="w-full h-[100px] lg:h-[200.56px] rounded relative" src={item.url} alt="" />
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
        </div>


    </Swiper>
  </>
}