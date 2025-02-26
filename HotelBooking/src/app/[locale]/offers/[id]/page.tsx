'use client';
import Offer_List_Json from "@/fakeData/offer_List.json";
import Hotel_List_Json from "@/fakeData/hotel_List.json";
import Hotel_List_Json_For_Offer from "@/fakeData/hotel_List_For_Offer.json";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Offer_Interface } from "@/types/offer";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import StarRating from "@/components/starrating/star-Rating";
import how_Many_Nights from "@/utils/how_Many_Nights";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import Form_Search_Pc from "@/components/form_Search/form_Search_Pc";
import { update_Hotel_Detail } from "@/store/hotel_Detail/hotel_Detail";
import { useTranslations } from "next-intl";

const initail_Offer = {
  offer_Id: '',
  offer_Name: '',
  offer_Price: 0,
  offer_Description: '',
  offer_Url: ''
}

export default function Offer () {
  // 1. 優惠列表、飯店列表 - 本地狀態
  const [offer_Id_List, set_Offer_Id_List] = useState(Offer_List_Json);
  const [the_Offer, set_The_Offer] = useState<Offer_Interface>(initail_Offer);
  const [hotel_List, set_Hotel_List] = useState<any>(Hotel_List_Json_For_Offer);
  const [country_List, set_Country_List] = useState<string[]>([]);
  const [country_Tab, set_Country_Tab] = useState<number>(0);
  const [country_Hotel_List, set_Country_Hotel_List] = useState<any[]>([])

  // 2. offer_Id - URL參數
  const params = useParams();
  // console.log(params.id, "看ID是啥");

  // 3. 匹配 offer_Id 函式
  const get_Offer_Id_List = async () => {
    // 3.1 拉出指定 Offer 優惠
    const new_The_Offer = offer_Id_List.find((item) => params.id === item.offer_Id);
    if(new_The_Offer) {
      set_The_Offer(new_The_Offer);
    };

    // 3.2 拉出匹配 Offer_Id 優惠ID 之 飯店列表
    if(params.locale === "zh-TW") {
      const new_Hotel_List = hotel_List.zhTW.filter((item: any) => params.id === item.offer_Id);
      set_Hotel_List(new_Hotel_List);
      return new_Hotel_List;
    } else {
      const new_Hotel_List = hotel_List.en.filter((item: any) => params.id === item.offer_Id);
      set_Hotel_List(new_Hotel_List);
      return new_Hotel_List;
    }
  };
  useEffect(() => {
    console.log(hotel_List, "看看看");
  },[hotel_List])

  // 4. 拉出匹配 offer_Id 的飯店列表, 並再拉出這些飯店的「國家」, 以便 Tab 點擊陣列使用
  const get_Country_List = async (target_Hotels: any) => {
    // 4.1 還不是陣列時(hotel_List_Json_For_Offer, 初始值最一開始是物件{zh-TW:[...], en:[...],} ) 就return
    if(!Array.isArray(target_Hotels)) return;
    const new_Country_List: string[] = target_Hotels.map((item: any) => item.country);
    // 4.2 只要唯一國家 (Set 去重複)
    const unique_Countries = Array.from(new Set(new_Country_List));
    set_Country_List(unique_Countries);

    // 4.3 一進畫面, 抓第一筆國家擁有此優惠之所有飯店
    click_Tab(unique_Countries[0], 0)
  }

  // 5. 點擊Tab, 取得不同國家, 但擁有同樣優惠之飯店列表
  const click_Tab = async (country: string , index: number,) => {
    // console.log(country, index, "傳參");
    const the_New_Hotel_List = hotel_List.filter((item: any) => country === item.country && params.id === item.offer_Id);
    set_Country_Hotel_List(the_New_Hotel_List);
    set_Country_Tab(index)
  }

  // 6. useEffect - 一進頁面, 執行 offer_Id 匹配函式
  useEffect(() => {
    const fetch_Data = async () => {
      try {
        // 5.1 非同步 await 拉到符合此優惠券之飯店, 再返回這包陣列給變數 matched_Hotels
        const matched_Hotels = await get_Offer_Id_List();
        // 5.2 非同步 await, 再把上述返回的陣列, 丟到國家列表判斷, 會返回 ["Thailand", "China", "United States"...] 等等
        // await get_Country_List(matched_Hotels);
      } catch (error) {
        console.log(error);
      }
    };


    fetch_Data();
  },[params.id])
  useEffect(() => {
    console.log(country_Hotel_List, "看一下飯店列表");
  },[country_Hotel_List])

  // 7. 一進畫面, hotel_List有變動, 抓最新的飯店列表(優惠券)
  useEffect(() => {
    get_Country_List(hotel_List);
  },[hotel_List])

  // 7. Redux - FormSearch 數據
  const redux_Form_Search = useSelector((state: RootState) => state.formSearch)
  const dispatch: AppDispatch = useDispatch();

  // 8. Redux - 相關初始值
  const redux_Destination = useSelector((state: RootState) => state.formSearch.keyword);
  const redux_DateRange = useSelector((state: RootState) => state.formSearch.dateRange);
  const redux_Date_Start = useSelector((state: RootState) => state.formSearch.start_Date);
  const redux_Date_End = useSelector((state: RootState) => state.formSearch.end_Date);
  const redux_Room = useSelector((state: RootState) => state.formSearch.room);
  const redux_Adult = useSelector((state: RootState) => state.formSearch.adult);
  const redux_Child = useSelector((state: RootState) => state.formSearch.child);
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  const timeStamp = + new Date();
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility);
  const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List2.hotel_List);
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);

  // 9. 查看「指定飯店所有房型」，ID匹配，router跳轉
  const router = useRouter()
  const check_Hotel_RoomType_List = (hotel_Id: string) => {
    const result = country_Hotel_List.find((item: add_Hotel_Detail_Interface) => item.hotel_Id === hotel_Id);
    if (result) {
      dispatch(update_Hotel_Detail(result));
    } else {
      console.error("沒拉到指定飯店明細");
    }
    console.log(hotel_Id, result);
    
    const query = new URLSearchParams({
      destination: redux_Destination,
      dateRange: redux_DateRange as string,
      date_Start: redux_Date_Start as string,
      date_End: redux_Date_End as string,
      room: String(redux_Room),
      adult: String(redux_Adult),
      child: String(redux_Child),
      rangeslider: String(redux_RangeSlider),
      timestamp: String(timeStamp),
      bedType: String(redux_BedType),
      rating: String(redux_Rating),
      facility: String(redux_Facility)
    }).toString()

    if(result) {
      console.log(result, "指定飯店 - 所有房型");
      router.push(`/hotellist/${hotel_Id}?${query}`)
    } else {
      alert("沒找到指定飯店 - 所有房型")
    }
  }

  // 10. next-intl i18n翻譯
  const t = useTranslations("OfferList");
  const t_FormSearch = useTranslations("FormSearch");


  return <>

    <div className="flex flex-col lg:mt-[70px] gap-2 lg:gap-10">

      {/** 確定拿到Offer大圖, 才渲染, 不然Next會報錯 */}
      {the_Offer.offer_Url && 
        <div className="relative">
          <Image src={the_Offer.offer_Url} alt={the_Offer.offer_Description} width={1920} height={1280}
          className="object-cover w-full lg:h-[320px]" priority={true}/>
          <p className="absolute bottom-[10%] left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 
            font-bold lg:text-3xl text-white">
            {t (the_Offer.offer_Description)}
          </p>
        </div>
      }
      {/** 確定拿到Offer大圖, 才渲染, 不然Next會報錯 */}


      {/** 虛線折價券 */}
      <div className="flex flex-col justify-center items-center gap-2 px-4 lg:px-0">
        <h2 className="text-lg lg:p-0 lg:text-3xl font-semibold">{t ("Use Promo Code below, Get Discounts")}</h2>
        <div className="border border-dashed rounded w-full h-auto px-4 py-2 lg:px-0 lg:w-52 lg:h-24 lg:self-center flex flex-col justify-center lg:items-center gap-2">
          <p className="text-customRed text-xl font-semibold">{t ("Discount")}: {the_Offer.offer_Price *100} %</p>
          <p className="text-sm font-semibold">{t ("Coupon Code")}: {the_Offer.offer_Id}</p>
        </div>
      </div>
      {/** 虛線折價券 */}


      {/** <form> 搜尋 */}
      <h2 className="text-center text-lg lg:p-0 lg:text-3xl font-semibold">{t ("Search for hotels by destination")}</h2>
      <Form_Search_Pc></Form_Search_Pc>
      {/** <form> 搜尋 */}

      
      <div className="p-4 lg:p-0 flex flex-col items-center gap-2">
        <h2 className="text-lg lg:text-3xl font-semibold">{t ("Recommendation")}</h2>
        <p className="lg:text-center">{t ("Search for applicable hotels from popular countries")}</p>
      </div>

      {/** Tab 國家切換標籤 */}
      <div className="px-4 lg:px-20">
        <ul className="flex gap-4 border-b border-softGray">
          {country_List.map((country, index) => 
            <li key={index} className={`cursor-pointer ${country_Tab === index ? 'text-primary border-b-2 border-primary' : '' }`} 
            onClick={() => click_Tab(country, index)}>{country}</li>)
          }
        </ul>
      </div>
      {/** Tab 國家切換標籤 */}


      {/** 飯店列表  - 卡片 */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-20">

        {country_Hotel_List.map((item, index) => {
          return <div key={index} className="rounded flex flex-col gap-2">
            
          {/* Swiper 飯店圖片 */}
          <div className="">
            <Swiper slidesPerView={1} 
            spaceBetween={5} 
            loop={false} 
            pagination={{ clickable: true }} 
            modules={[Pagination]}>
              
              {item.hotel_Image_List.map((img: any, index: number) => {
                return <SwiperSlide key={index}>
                  <img src={img.url} alt={img.description} 
                  className="w-full h-[200px] object-cover rounded" />
                </SwiperSlide>
              })}
              
            </Swiper>
            {/* Swiper 飯店圖片 */}
          </div>
            
            {/** 飯店名 */}
            <p>{item.hotel_Name}</p>
            {/** 飯店名 */}

            {/** 總平均五星、飯店最低價格 */}
            <div className="flex justify-between">
              <StarRating ranking={item.totalRating as number}></StarRating>
              <p className="font-semibold">${item.price}</p>
            </div>
            {/** 總平均五星、飯店最低價格 */}
            

            {/** 飯店總評論、住幾人幾晚 */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <p className="bg-blue px-2 rounded text-white">{item.totalRating}</p>
                <p>{` (Reviews: ${item.review_List.length})`}</p>
              </div>
              <p className="lg:text-xs">Tax Included</p>
            </div>
            <div className="flex justify-end">
            <p className="text-xs">{`${redux_Form_Search.room} ${t_FormSearch ("Room")} ${redux_Form_Search.adult + redux_Form_Search.child} ${t_FormSearch ("Guests")} 
                ${how_Many_Nights(redux_Form_Search.start_Date as string, redux_Form_Search.end_Date as string)} ${t_FormSearch ("Nights")}`}</p>
            </div>
            {/** 飯店總評論、住幾人幾晚 */}
            
            {/** 跳轉至指定飯店 */}
            <div className="flex justify-end">
              <button type="button" className="bg-primary rounded text-white px-4 py-2"
              onClick={() => check_Hotel_RoomType_List(item.hotel_Id as string)}>{t ("Book Now")}</button>
            </div>
            {/** 跳轉至指定飯店 */}
            
            <div className="border-b border-softGray"></div>

          
          </div>
        })}

      </div>
      {/** 飯店列表  - 卡片 */}

    </div>
  </>
}