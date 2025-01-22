'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import Hotel_List from "../../fakeData/hotel_List.json";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Hotel_List_Card() {
  
  // 1.
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

  // 1. 查看「指定飯店所有房型」，ID匹配，router跳轉
  const router = useRouter()
  const check_Hotel_RoomType_List = (id: string) => {
    const result = Hotel_List.find((item) => item.id === id);

    
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
      router.push(`/hotellist/${id}?${query}`)
    } else {
      alert("沒找到指定飯店 - 所有房型")
    }
  }


  return <>

    {/** 飯店列表卡片 */}
    {Hotel_List.map((item) => {
      return <div key={item.id} className="space-y-4">
        <article className="bg-white rounded-lg overflow-hidden shadow-sm">

          {/* Swiper 飯店圖片 */}
          <Swiper slidesPerView={1.25} spaceBetween={5} loop={true} pagination={{ clickable: true }} modules={[Pagination]}>
            {item.images.map((img, index) => {
              return <SwiperSlide key={index}>
                <img src={img.url} alt={img.description} 
                className="w-full h-[200px] object-cover object-top rounded" />
              </SwiperSlide>
            })}
          </Swiper>
          {/* Swiper 飯店圖片 */}


          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.distance}</p>
              </div>
              <div className="flex items-center gap-1 bg-softGray text-custom px-2 py-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">

                  {item.rating}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hidden">
              {item.facilities.map((facility, index) => {
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
                onClick={() => check_Hotel_RoomType_List(item.id)}>
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