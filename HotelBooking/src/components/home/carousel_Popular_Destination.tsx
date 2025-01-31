'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';



export default function Carousel_Popular_Destination() {
  const swiperImg = [
    {
      url: '/home/popular_6.webp',
      text1: 'New Year Spceial!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "Paris"
    },
    {
      url: '/home/popular_5.webp',
      text1: 'Eid-ul-Fitr Special!',
      text2: '50% discount on Maldives International Flights.',
      cityName: "Tokyo"
    },
    {
      url: '/home/popular_8.webp',
      text1: 'New Year Spceial!',
      text2: 'Up to 25% off on local Transportation.',
      cityName: "Dubai"
    },
    {
      url: '/home/popular_9.webp',
      text1: 'Black Friday Special!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "Australia"
    },
    {
      url: '/home/popular_10.webp',
      text1: 'Black Friday Special!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "UK"
    },
    {
      url: '/home/popular_11.webp',
      text1: 'Black Friday Special!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "Korea"
    },
    {
      url: '/home/popular_12.webp',
      text1: 'Black Friday Special!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "Taiwan"
    },
    {
      url: '/home/popular_13.webp',
      text1: 'Black Friday Special!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "United States"
    },
  ]



  return <>
    <Swiper slidesPerView={2.7} spaceBetween={20}
      modules={[Navigation]}
      navigation={true}
      breakpoints={{
        1024: {slidesPerView: 4.2}
      }}
    >
      <div className="flex">
        {swiperImg.map((item, index) =>
          <SwiperSlide key={index}>
            <img className="w-full h-[100px] lg:h-[174.56px] object-cover rounded " src={item.url} alt="" />
            <p className="text-center pt-2">{item.cityName}</p>
          </SwiperSlide>
        )}
      </div>

    </Swiper>
  </>
}