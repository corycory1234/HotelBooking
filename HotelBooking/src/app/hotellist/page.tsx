'use client';
import BackPage from "../../components/back-Page/backPage";
import Server_Form_Search from "../../components/server-Form-Search/server-Form-Search";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Client_Filter_Button from "../../components/client-Filter-Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import Half_Modal from "../../components/modal/half-modal";
import Hotel_List from "../../fakeData/hotel_List.json";
import { Submit_Search } from "@/actions";

export default function HotelList () {
  // 1.  這些Params都來自於 Server Action - Submit_Form函式
  // 1.1 必須要對接這些Params, /hotellist?destination...路由, 才可以運作
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  // const dateRange = searchParams.get("dateRange");
  const room = searchParams.get("room");
  const adult = searchParams.get("adult");
  const child = searchParams.get("child");
  const timestamp = searchParams.get("timestamp");

  // 2. 監聽 Params
  useEffect(() => {
    console.log(destination, room, adult, child, timestamp);
    Submit_Search
  },[destination, room, adult, child, timestamp])

  // 3. Sort 彈跳Modal開關
  const [formSort, setFormSort] = useState<boolean>(false);
  const show_FormSort = () => {
    setFormSort(!formSort)
  };

  // 4. Sort 傳遞<input type="radio"> 之 Value 與 傳遞函式 set_Sort_Value
  const [sort_Value, set_Sort_Value] = useState("");

  return <>
  <title>HOTEL</title>
  <BackPage></BackPage>

  <div className="fixed top-[56px] left-0 right-0 bg-white z-40 border-b border-gray">
    {/* Filter 與 熱門搜尋條件 */}
      <Client_Filter_Button></Client_Filter_Button>
    {/* Filter 與 熱門搜尋條件 */}
  </div>

<main className="pt-28 px-4 pb-4">

  <div className="flex items-center justify-between pb-4">
    <p className="text-sm">{Hotel_List.length} hotels</p>
    
    {/* ↑↓Sort 排序  */}
    <div className="flex items-center gap-1 border border-gray rounded px-2 py-1" onClick={show_FormSort}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
      <span>Sort</span>
    </div>
    {/* ↑↓Sort 排序  */}

    {/* ↑↓Sort 排序 - 彈跳Modal  */}
    <Half_Modal isOpen={formSort} onClose={() => setFormSort(false)} 
    sort_Value={sort_Value} 
    set_Sort_Value={set_Sort_Value}>

    </Half_Modal>
    {/* ↑↓Sort 排序 - 彈跳Modal  */}
  </div>
  
  {/** 飯店卡片 */}
  {Hotel_List.map((item) => {
    return <div key={item.id} className="space-y-4">
      <article className="bg-white rounded-lg overflow-hidden shadow-sm">
      
      {/* Swiper 飯店圖片 */}
      <Swiper slidesPerView={1.25} spaceBetween={5} loop={true} pagination={{clickable: true}} modules={[Pagination]}>
        {item.images.map((img, index) => {
          return <SwiperSlide key={index}>
            <img src={img.url} alt={img.description} className="w-full h-[200px] object-cover object-top rounded"/>
          </SwiperSlide>
        })}
      </Swiper>
      {/* Swiper 飯店圖片 */}


        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{item.name}</h3>
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
          <div className="flex gap-2 mt-3">
            {item.facilities.map((facility, index) => {
              return <span className="text-xs px-2 py-1 bg-softGray rounded" key={index}>
                {facility}
              </span>
            })}

          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-xl font-semibold">$ {item.price}</span>
              <span className="text-sm text-gray-500">/night</span>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Book Now</button>
          </div>


        </div>
      </article>
    </div>
  })}
  {/** 飯店卡片 */}

</main>

  </>
}