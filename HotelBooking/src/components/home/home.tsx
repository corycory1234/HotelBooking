'use client';
import Menu from "../menu";
import Nav from "../nav/nav";
import Footer from "../footer/footer";
import Index_Form_Search from "../form_Search/index_Form_Search";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import Offer_List_Json from "@/fakeData/offer_List.json";
import { useRouter } from "next/navigation";
import StarRating from "../starrating/star-Rating";
import {useTranslations} from 'next-intl';
import { useParams } from "next/navigation";


const swiper_Popular_Destination = [
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
];

const swiper_Hotel_Around = [
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

export default function Index() {
// 1. Redux - 查看是否登入
const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);

// 2. 路由
const router = useRouter();
const params = useParams();

// 3. 點擊輪播圖 - 傳遞 offer_Id 參數
const check_Offer = (offer_Id: string) => {
  router.push(`/${params.locale}/offers/${offer_Id}`);
};

// 4.
const t = useTranslations('HomePage');

  return <>
    <div className="bg-home-explore lg:bg-home-explore-desktop w-full h-52 lg:h-[20rem] bg-no-repeat bg-cover bg-center">
    
    {/********************* PC桌機 - Nav導覽 ******************************/}
      <Nav></Nav>
    {/********************* PC桌機 - Nav導覽 ******************************/}

    {/********************* 手機版 - Avatar頭像 ******************************/}
      {redux_Verify_Session.success === true ? 
      <div className="flex justify-end p-2 lg:h-[28%]">
        <Link href={"/profile"} className="lg:hidden">
          <img src="/account/avatarsm.png" alt="" />
        </Link>
      </div>
      : 
      <div className="flex justify-between p-4 h-[28%]">
        <></>
      </div>
    }
  {/********************* 手機版 - Avatar頭像 *******************************/}


  {/************************* Explore The World 文字 ***********************/}
    <div className="flex p-4 lg:px-[8.5%]">
      <div className="basis-1/2 flex flex-col">
        <h1 className="text-[24px] text-white font-semibold">{t ("Let's Explore The World!")}</h1>
      </div>
    </div>
  {/************************* Explore The World 文字 ***********************/}


      <div className="min-h-screen w-full my-bg-gradient lg:bg-none lg:w-5/6 lg:mx-auto flex flex-col">
        <div className="lg:bg-white lg:rounded-lg">
          {/* 這個組件裡面有三個 hidden input: room, adult, child */}
          <Index_Form_Search></Index_Form_Search>
          {/* 這個組件裡面有三個 hidden input: room, adult, child */}
        </div>

        
        <div className="flex flex-col p-4 gap-4 pb-20 lg:px-0">
        {/********************* Swiper - 熱門地點 *******************************/}
          <h2 className="font-bold">{t ("Popular Destinations")}</h2>
          <div className="">
            <Swiper slidesPerView={2.7} spaceBetween={20}
              modules={[Navigation]}
              navigation={true}
              breakpoints={{
                1024: {slidesPerView: 4.2}
              }}>
            <div className="flex">
              {swiper_Popular_Destination.map((item, index) =>
                <SwiperSlide key={index}>
                  <img className="w-full h-[100px] lg:h-[174.56px] object-cover rounded " src={item.url} alt="" />
                  <p className="text-center pt-2">{item.cityName}</p>
                </SwiperSlide>
              )}
            </div>
            </Swiper>
          </div>
        {/********************* Swiper - 熱門地點 *******************************/}
          

        {/********************* Swiper - 優惠券飯店 *******************************/}
          <h2 className="font-bold">{t ("Promotions")}</h2>
          <div className="">
            <Swiper slidesPerView={2.7} spaceBetween={20}
              modules={[Navigation]}
              navigation={true}
              breakpoints={{
                1024: {slidesPerView: 4}
              }}>
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
          </div>
        {/********************* Swiper - 優惠券飯店 *******************************/}


        {/********************* Swiper - 附近飯店 *******************************/}
          <h2 className="font-bold">{t ("Hotels Around You")}</h2>
          <div className="">
            <Swiper slidesPerView={2} spaceBetween={20}
              modules={[Navigation]}
              navigation={true}
              breakpoints={{
                1024: {slidesPerView: 5.2}
              }}>
                <div className="flex">
                {swiper_Hotel_Around.map((item, index) =>
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
          </div>
        {/********************* Swiper - 附近飯店 *******************************/}

        </div>

        <Footer></Footer>

      </div>

    </div>

    <div className="lg:hidden">
      <Menu></Menu>
    </div>
  </>


}