'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';



export default function Carousel() {
  const swiperImg = [
    {
      url: '/home/Popular_1.webp',
      text1: 'New Year Spceial!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "Paris"
    },
    {
      url: '/home/Popular_2.webp',
      text1: 'Eid-ul-Fitr Special!',
      text2: '50% discount on Maldives International Flights.',
      cityName: "Tokyo"
    },
    {
      url: '/home/Popular_3.webp',
      text1: 'New Year Spceial!',
      text2: 'Up to 25% off on local Transportation.',
      cityName: "Dubai"
    },
    {
      url: '/home/Popular_4.webp',
      text1: 'Black Friday Special!',
      text2: 'Get a free lunch using Coupon *GoTour*',
      cityName: "Paris"
    },
  ]



  return <>
    <Swiper slidesPerView={2.7} spaceBetween={20}>
      <div className="">
        {swiperImg.map((item, index) =>
          <SwiperSlide key={index}>
            <img className="w-full h-full object-cover rounded" src={item.url} alt="" />
            <p className="text-center pt-2">{item.cityName}</p>
          </SwiperSlide>
        )}
      </div>

    </Swiper>
  </>
}