'use client';
import Menu from "../menu";
import Nav from "../nav/nav";
import Footer from "../footer/footer";
import Index_Form_Search from "../formSearch/index_Form_Search";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import Offer_List_Json from "@/fakeData/offer_List.json";
import { useRouter } from "next/navigation";
import StarRating from "../starrating/star-Rating";
import {useTranslations} from 'next-intl';
import { useParams } from "next/navigation";
import { updateBedType, updateFacility, updateKeyword, updateRangeSlider, updateRating } from "@/store/form-Search/formSearchSlice";
import { useEffect, useState } from "react";
import Swiper_Hotel_Around_Json from "@/fakeData/swiper_Hotel_Around.json";
// import { supabase } from "@/lib/supabase_Client";
import Image from "next/image";


const swiper_Popular_Destination = [
  {
    url: '/home/popular_1.webp',
    text1: 'New Year Spceial!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "Bangkok"
  },
  {
    url: '/home/popular_5.webp',
    text1: 'Eid-ul-Fitr Special!',
    text2: '50% discount on Maldives International Flights.',
    cityName: "Japan"
  },
  {
    url: '/home/popular_2.webp',
    text1: 'New Year Spceial!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "China"
  },
  {
    url: '/home/popular_4.webp',
    text1: 'New Year Spceial!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "Vietnam"
  },
  {
    url: '/home/popular_14.webp',
    text1: 'New Year Spceial!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "Singapore"
  },
  {
    url: '/home/popular_6.webp',
    text1: 'Black Friday Special!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "Ireland"
  },
  {
    url: '/home/popular_12.webp',
    text1: 'Black Friday Special!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "Taiwan"
  },
  {
    url: '/home/popular_9.webp',
    text1: 'Black Friday Special!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "Australia"
  },
  // {
  //   url: '/home/popular_10.webp',
  //   text1: 'Black Friday Special!',
  //   text2: 'Get a free lunch using Coupon *GoTour*',
  //   cityName: "UK"
  // },
  {
    url: '/home/popular_11.webp',
    text1: 'Black Friday Special!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "Korea"
  },
  {
    url: '/home/popular_13.webp',
    text1: 'Black Friday Special!',
    text2: 'Get a free lunch using Coupon *GoTour*',
    cityName: "United States"
  },
];

export default function Index() {
// 1. Redux - 查看是否登入
const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);
const redux_Keyword = useSelector((state: RootState) => state.formSearch.keyword);
const redux_DateRange = useSelector((state: RootState) => state.formSearch.dateRange);
const redux_Start_Date = useSelector((state: RootState) => state.formSearch.start_Date);
const redux_End_Date = useSelector((state: RootState) => state.formSearch.end_Date);
const redux_Room = useSelector((state: RootState) => state.formSearch.room);
const redux_Adult = useSelector((state: RootState) => state.formSearch.adult);
const redux_Child = useSelector((state: RootState) => state.formSearch.child);
const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);
const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
const redux_Facility = useSelector((state: RootState) => state.formSearch.facility);
const dispatch: AppDispatch = useDispatch();

// 2. 路由
const router = useRouter();
const params = useParams();

// 3. 查看優惠飯店 - 傳遞 offer_Id 參數
const check_Offer = (offer_Id: string) => {
  router.push(`/${params.locale}/offers/${offer_Id}`);
};

// 4. next-intl 翻譯
const t = useTranslations('HomePage');
const t_Offer = useTranslations("OfferList");

// 5. 查看熱門地點 (跳轉HotelList頁面)
const check_Popular_Destination = (popular_Destination: string) => {

  // 5.1 更新 Redux_Keyword
  dispatch(updateKeyword(t (popular_Destination)));
  
  // 5.2 URL參數, 轉字串
  const timestamp = +new Date();
  const search_Params = new URLSearchParams({
    // destination: redux_Keyword as string,
    destination: popular_Destination as string,
    dateRange: redux_DateRange as string,
    date_Start: redux_Start_Date as string,
    date_End: redux_End_Date as string,
    room: String(redux_Room),
    adult: String(redux_Adult),
    child: String(redux_Child),
    rangeslider: String(redux_RangeSlider),
    timestamp: String(timestamp),
    bedtype: String(redux_BedType),
    rating: String(redux_Rating),
    facility: String(redux_Facility),
    page: "1"
  }).toString()
  
  // 5.3 跳轉到 hotel_List頁面, 讓hotel_List頁面自己打API
  router.push(`/hotellist?${search_Params}`);
  

}

  // 6. 一進首頁, 關鍵字、進階搜尋初始化
  useEffect(() => {
    dispatch(updateKeyword(""));
    dispatch(updateRangeSlider([100, 9900]))
    dispatch(updateBedType([]));
    dispatch(updateRating([]));
    dispatch(updateFacility([]));
  },[])

  // 7. 附近飯店 >> 跳轉/hotellist/${hotel_Id}
  const fetch_Hotel_Detail = (hotel_Id: string, hotel_Name: string) => {
    dispatch(updateKeyword(hotel_Name))
    router.push(`/${params.locale}/hotellist/${hotel_Id}`)
  };

  //
  // const [token, setToken] = useState<string | null>(null);
  // const [userEmail, setUserEmail] = useState<string | null>(null);
  // useEffect(() => {
  //   async function fetchSession() {
  //     const {data, error} = await supabase.auth.getSession();
  //     console.log(data, "看一下data");
  //     if(!error && data.session) {
  //       setToken(data.session.access_token);
  //       setUserEmail(data.session.user?.email ?? null);
  //     }
  //   };

  //   fetchSession();
  // },[])
  // useEffect(() => {
  //   console.log(token);
  //   console.log(userEmail);
  // },[token, userEmail])

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

        
        <div className="flex flex-col p-4 gap-4 pb-20 lg:px-0 lg:py-8">
        {/********************* Swiper - 熱門地點 *******************************/}
          <h2 className="font-bold text-lg">{t ("Popular Destinations")}</h2>
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
                  <Image 
                  width={200} height={200}
                  priority={true}
                  className="w-full h-[100px] lg:h-[174.56px] object-cover rounded cursor-pointer" 
                  src={item.url} alt={item.text1} onClick={() => check_Popular_Destination(item.cityName)}/>
                  <p className="text-xs text-center pt-2 font-semibold lg:text-base">{t (item.cityName)}</p>
                </SwiperSlide>
              )}
            </div>
            </Swiper>
          </div>
        {/********************* Swiper - 熱門地點 *******************************/}
          

        {/********************* Swiper - 優惠券飯店 *******************************/}
          <h2 className="font-bold text-lg">{t ("Promotions")}</h2>
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
                  <Image 
                  width={200} height={200}
                  priority={true}
                  className="w-full h-[100px] lg:h-[174.56px] object-cover rounded cursor-pointer" src={item.offer_Url} alt={item.offer_Description} 
                  onClick={() => check_Offer(item.offer_Id)}/>
                  <p className="text-xs text-center pt-2 font-semibold lg:text-base">{t_Offer (item.offer_Description)}</p>
                </SwiperSlide>
              )}
            </div>
            </Swiper>
          </div>
        {/********************* Swiper - 優惠券飯店 *******************************/}


        {/********************* Swiper - 附近飯店 *******************************/}
          <h2 className="font-bold">{t ("Hotels Around You")}</h2>
          <div className="">
            <Swiper slidesPerView={2.2} spaceBetween={20}
              modules={[Navigation]}
              navigation={true}
              breakpoints={{
                1024: {slidesPerView: 4.2}
              }}>
                <div className="flex">
                  {params.locale === "zh-TW" ? <>
                    {Swiper_Hotel_Around_Json.zh_TW.map((item, index) =>
                      <SwiperSlide key={index} className="flex-col cursor-pointer" onClick={() => fetch_Hotel_Detail(item.hotel_Id, item.hotel_Name)}>
                        <Image
                        width={200} height={200}
                        priority={true}
                        className="w-full h-[100px] lg:h-[200.56px] rounded relative" src={item.url} alt="" />
                        {/* <div className="absolute top-2 right-2 w-[16px] h-[16px] bg-white rounded-full flex justify-center items-center">
                          <img className="" src="/home/Bookmark.svg" alt="" />
                        </div> */}
                        <div className="flex flex-col gap-1 p-2">
                          <h2 className="text-xs h-10 lg:h-auto">{item.hotel_Name}</h2>
                          <div className="flex flex-col gap-1 lg:flex-row lg:justify-between">
                            <StarRating ranking={item.total_Rating}></StarRating>
                            <p className="text-xs text-primary font-semibold">
                              {'$' + item.price + '/'} 
                              <span className="text-xs text-soft-gray">night</span>
                              </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    )}
                  
                  </>
                  : 
                  <>
                    {Swiper_Hotel_Around_Json.en.map((item, index) =>
                      <SwiperSlide key={index} className="flex-col cursor-pointer" onClick={() => fetch_Hotel_Detail(item.hotel_Id, item.hotel_Name)}>
                        <Image
                        width={200} height={200}
                        priority={true}
                        className="w-full h-[100px] lg:h-[200.56px] rounded relative" src={item.url} alt="" />
                        {/* <div className="absolute top-2 right-2 w-[16px] h-[16px] bg-white rounded-full flex justify-center items-center">
                          <img className="" src="/home/Bookmark.svg" alt="" />
                        </div> */}
                        <div className="flex flex-col gap-1 p-2">
                          <h2 className="text-xs line-clamp-1">{item.hotel_Name}</h2>
                          <div className="flex flex-col gap-1 lg:flex-row lg:justify-between">
                            <StarRating ranking={item.total_Rating}></StarRating>
                            <p className="text-xs text-primary font-semibold">
                              {'$' + item.price + '/'} 
                              <span className="text-xs text-soft-gray">night</span>
                              </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    )}
                  </>
                
                }
                </div>
            </Swiper>
          </div>
        {/********************* Swiper - 附近飯店 *******************************/}
        </div>


      </div>

      <div className="px-4">
        <Footer></Footer>
      </div>

    </div>

    <div className="lg:hidden">
      <Menu></Menu>
    </div>
  </>


}