'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';



export default function Carousel() {
  const swiperImg = [
    {
      url: '/home/Popular_1.png',
      text1: 'New Year Spceial!',
      text2: 'Get a free lunch using Coupon *GoTour*'
    },
    {
      url: '/home/Popular_2.png',
      text1: 'Eid-ul-Fitr Special!',
      text2: '50% discount on Maldives International Flights.'
    },
    {
      url: '/home/Popular_3.png',
      text1: 'New Year Spceial!',
      text2: 'Up to 25% off on local Transportation.'
    },
    {
      url: '/home/Popular_4.png',
      text1: 'Black Friday Special!',
      text2: 'Get a free lunch using Coupon *GoTour*'
    },
  ]



  return <>
    <Swiper slidesPerView={2.7} spaceBetween={20}>
      <div className="relative">
        {swiperImg.map((item, index) =>
          <SwiperSlide key={index}>
            <img className="w-full h-full object-cover rounded" src={item.url} alt="" />
            <p className="absolute left-2 bottom-6 text-secondary text-[8px]">{item.text1}</p>
            <p className="absolute left-2 bottom-1 text-white text-[8px]">{item.text2}</p>
          </SwiperSlide>
        )}
      </div>

    </Swiper>
  </>
}