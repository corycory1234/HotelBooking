'use client';
import BackPage from "../../components/back-Page/backPage";
// import Server_Form_Search from "../../components/server-Form-Search/server-Form-Search";
import Index_Form_Search from "../../components/form_Search/index_Form_Search";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Client_Filter_Button from "../../components/client-Filter-Button";
import Hotel_List_Card from "@/components/hotel_List/hotel_List_Card";
import Half_Modal from "../../components/modal/half-modal";
import { Submit_Search } from "@/actions";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Not_Found from "@/components/not_Found/not_Found";
import hotel_List_Json from "@/fakeData/hotel_List.json";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";


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

  // 4. Sort 傳遞<input type="radio"> 之 Value 與 傳遞函式 set_Sort_Value
  const [sort_Value, set_Sort_Value] = useState("");

  // 2. Skeleton動畫 - 延遲2秒 (這邊待API寫好, 於useEffect)
  // const [show_Hotel_List, set_Show_Hotel_List] = useState<boolean>(false);
  // useEffect(() => {
  //   set_Show_Hotel_List(false) // 第2次進頁面, 從 true >> false
  //   const timer = setTimeout(() => {
  //     set_Show_Hotel_List(true);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // },[timestamp])

  // 3. Skeleton動畫 - 佔位符
  // const Placeholder_Card = () => {
  //   return <div className="flex flex-col gap-2 lg:hidden">
  //     <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
  //     <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
  //     <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

  //     <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
  //     <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
  //     <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>

  //     <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray"></div>
  //     <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded"></h3>
  //     <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded"></h3>
  //   </div>
  // }

  // 5. Redux - 飯店列表
  const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List2.hotel_List)
  // const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List);
  const dispatch = useDispatch();
  useEffect(() => {
    const hotel_List = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
      // 3.1 飯店名、飯店城市、飯店國家，一同匹配
      return (
        hotel.hotel_Name?.toLowerCase().includes((destination as string).toLowerCase()) ||
        hotel.city?.toLowerCase().includes((destination as string).toLowerCase()) ||
        hotel.country?.toLowerCase().includes((destination as string).toLowerCase())
      )
    })
    dispatch(update_Hotel_List(hotel_List))
  },[])
  useEffect(() => {
    console.log(redux_Hotel_List, "Redux有撈到飯店嘛");
  },[redux_Hotel_List])

  return <>
  <BackPage></BackPage>

  {/** 沒找到, 就<Not_Found> */}
  {redux_Hotel_List.length <=0 ? <Not_Found you_Have_No_Bookings="Hotels Not Found"></Not_Found> 
  
  : 
  <>
    <div className="sticky top-[72px] left-0 right-0 bg-white z-40 border-b border-gray lg:hidden">
      {/* Filter 與 熱門搜尋條件 */}
        <Client_Filter_Button></Client_Filter_Button>
      {/* Filter 與 熱門搜尋條件 */}
    </div>

  <main className="p-4">

    {/* ↑↓Sort 排序  */}
    <div className="flex items-center justify-between pb-4 lg:hidden">
      <p className="text-sm">{redux_Hotel_List.length} hotels</p>
      
      <div className="flex items-center gap-1 border border-gray rounded px-2 py-1" onClick={()=> setFormSort(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5" >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
        <span>Sort</span>
      </div>

      {/* ↑↓Sort 排序 - 彈跳Modal  */}
      <Half_Modal isOpen={formSort} onClose={() => setFormSort(false)} 
        sort_Value={sort_Value} 
        set_Sort_Value={set_Sort_Value}>
      </Half_Modal>
      {/* ↑↓Sort 排序 - 彈跳Modal  */}

    </div>
    {/* ↑↓Sort 排序  */}

    
    {/** 飯店列表卡片 */}
      {/* {!show_Hotel_List ? <Placeholder_Card></Placeholder_Card> 
      :<Hotel_List_Card></Hotel_List_Card>} */}

  <Hotel_List_Card></Hotel_List_Card>
    {/** 飯店列表卡片 */}

  </main>
  </>
  }


  </>
}