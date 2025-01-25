'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import Hotel_List_Json from "../../fakeData/hotel_List.json";
import { OtherSVG } from "../client_Svg/client_Svg";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { add_My_Collection, delete_My_Collection } from "@/store/my_Collection/my_Collection_Slice";
import { update_Hotel_List, to_Full_Heart, to_Empty_Heart  } from "@/store/hotel_List/hotel_List_Slice";

export default function Hotel_List_Card() {
  // 0. 呼叫 Redux - Action 函式
  const dispatch: AppDispatch = useDispatch()
  
  // 1. Redux - 相關初始值
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

  // 1. 一進頁面, 拉JSON假數據 給 Redux (只要F5都會變初始) 
  // useEffect(() => {
  //   dispatch(update_Hotel_List(Hotel_List_Json))
  // },[])

  // 2. 查看「指定飯店所有房型」，ID匹配，router跳轉
  const router = useRouter()
  const check_Hotel_RoomType_List = (hotel_Id: string) => {
    const result = redux_Hotel_List.find((item) => item.hotel_Id === hotel_Id);

    
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

  // 3. 新增收藏飯店
  const add_Collection = (hotel: add_Hotel_Detail_Interface) => {
    dispatch(to_Full_Heart(hotel));
    dispatch(add_My_Collection(hotel));
  }

  // 4. 刪除收藏飯店
  const delete_Collection = (hotel: add_Hotel_Detail_Interface) => {
    dispatch(to_Empty_Heart(hotel));
    dispatch(delete_My_Collection(hotel));
  }

  return <>

    {/** 飯店列表卡片 */}
    {redux_Hotel_List.map((item) => {
      return <div key={item.hotel_Id} className="space-y-4">
        <article className="bg-white rounded-lg overflow-hidden shadow-sm">

          {/* Swiper 飯店圖片 */}
          <Swiper slidesPerView={1.25} spaceBetween={5} loop={true} pagination={{ clickable: true }} modules={[Pagination]}>
            {item.hotel_Image_List.map((img, index) => {
              return <SwiperSlide key={index}>
                <img src={img.url} alt={img.description} 
                className="w-full h-[200px] object-cover object-top rounded" />
              </SwiperSlide>
            })}
          </Swiper>
          {/* Swiper 飯店圖片 */}


          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{item.hotel_Name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.distance}</p>
              </div>

              <div className="flex flex-col gap-2 justify-center items-center">
                <div className="flex items-center gap-1 bg-softGray text-custom px-2 py-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-yellow-500">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">

                    {item.totalRating}
                  </span>
                </div>

                {item.isCollected === false ? <>
                  <div className="cursor-pointer">
                    <OtherSVG name="emptyheart" className="w-5 h-auto"
                    onClick={() => add_Collection(item)}></OtherSVG>
                  </div>
                </>
                : <>
                  <div className="cursor-pointer">
                    <OtherSVG name="fullheart" className="w-5 h-auto"
                    onClick={() => delete_Collection(item)}></OtherSVG>
                  </div>
                
                </>
                }
              </div>


            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hidden">
              {item.facility_List?.map((facility, index) => {
                return <span className="text-xs px-2 py-1 bg-softGray rounded" key={index}>
                  {facility.charAt(0).toUpperCase() + facility.slice(1)}
                </span>
              })}

            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-xl font-semibold">$ {item.price}</span>
                <span className="text-sm text-gray-500">/night</span>
              </div>
              {/* <Link href={`/hotellist/${item.id}`}> */}
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                onClick={() => check_Hotel_RoomType_List(item.hotel_Id as string)}>
                Book Now
              </button>
              {/* </Link> */}
            </div>


          </div>
        </article>
      </div>
    })}
    {/** 飯店列表卡片 */}


  </>
}