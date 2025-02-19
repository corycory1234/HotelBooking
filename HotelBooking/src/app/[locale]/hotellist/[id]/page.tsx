'use client';
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useState, useEffect } from "react";
import Modal from "@/components/modal/modal";
// import Server_Form_Search from "@/components/server-Form-Search/server-Form-Search";
import Hotel_Detail_Card from "@/components/hotel_Card/hotel_Detail_Card";
import { update_Hotel_Detail } from "@/store/hotel_Detail/hotel_Detail";
import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import DateRangePicker from "@/components/form_Search/dateRangePicker";
import Client_Input_Traveler from "@/components/form_Search/client-Input-Traveler";
import Client_Input_Keyword from "@/components/form_Search/client-Input-Keyword";
import { updateKeyword } from "@/store/form-Search/formSearchSlice";
import { Refresh_Search_Hotel_Detail, Search_Params_Interface } from "@/utils/refresh_Search_Hotel_Detail";


export default function Hotel_Detail () {
  // 0.
  const searchParams = useSearchParams();
  const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List2.hotel_List);
  const redux_Form_Search = useSelector((state: RootState) => state.formSearch);
  const redux_Destination = useSelector((state: RootState) => state.formSearch.keyword);
  const reduxDateRange = useSelector((state: RootState) => state.formSearch.dateRange);
  const redux_Date_Start = useSelector((state: RootState) => state.formSearch.start_Date);
  const redux_Date_End = useSelector((state: RootState) => state.formSearch.end_Date);
  const redux_Room = useSelector((state: RootState) => state.formSearch.room);
  const redux_Adult = useSelector((state: RootState) => state.formSearch.adult);
  const redux_Child = useSelector((state: RootState) => state.formSearch.child);
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  // const timeStamp = + new Date();
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility);

  // 1. 返回上一頁
  const router = useRouter();

  // 2. 抓 URL - ID
  const params = useParams();

  // 3. dispatch 拿取 Redux 之 Action函式
  const dispatch: AppDispatch = useDispatch();

  // 4. 撈 JSON 當中的指定飯店 - JSON 假資料要吃 TS型別, 不然會報錯
  // const hotel_List_Typed: Hotel_Detail_Interface[] = hotel_List as Hotel_Detail_Interface[];
  // const hotel_List_Typed: add_Hotel_Detail_Interface[] = redux_Hotel_List;
  // const the_Found_Hotel = hotel_List_Typed.find((item) => params.id === item.id);
  // const the_Found_Hotel = hotel_List_Typed.find((item) => item.hotel_Id === params.id);

  // 4. 飯店明細API
  const fetch_Hotel_Detail = async () => {
    try {
      const hotel_Detail_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels/${params.id}`;
      const response = await fetch(hotel_Detail_Url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      });
      if(!response) {throw new Error(`伺服器錯誤`)};
      const result = await response.json();
      dispatch(update_Hotel_Detail(result.data));
      console.log(result, "查看後端API - 飯店明細之回應");
    } catch (error) {
      console.log(error);
    }
  }

  // 5.  生命週期：組件載入後，dispatch 更新 Redux
  // 5.1 也可寫在 useEffect 中，只在 id 變動時重新 dispatch
  useEffect(() => {
    fetch_Hotel_Detail();
    // if(the_Found_Hotel) {
    //   dispatch(update_Hotel_Detail(the_Found_Hotel));
    //    // 5.2 於 hotel_Detail頁面, 將 關鍵字 更新成 >> 飯店名
    //   // dispatch(updateKeyword(the_Found_Hotel.hotel_Name as string))
    // }
  },[]);

  // 6. Redux - 指定飯店明細
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);
  // console.log("Redux 指定飯店", redux_Hotel_Detail);
  

  // 7. Redux - 入住退房日; replace搭配正則，把"202X -"拿掉
  const redux_DateRange = useSelector((state: RootState) => state.formSearch.dateRange)?.replace(/\d{4}-/g, "");
  
  // 8. <form>搜尋 Modal 開關
  const [toggle, set_Toggle] = useState<boolean>(false);
  const show_FormSearch = () => set_Toggle(true);

  // 9. Redux - 搜尋關鍵字, 於 hotel_Detail頁面, 將 關鍵字 更新成 >> 飯店名
  const redux_Keyword = useSelector((state: RootState) => state.formSearch.keyword);

  // 10. 搜尋指定飯店 - 帶入新參數條件
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const form_Data = new FormData(event?.currentTarget);
    const dateRange = form_Data.get("datepicker") as string;
    const room = form_Data.get("room");
    const adult = form_Data.get("adult");
    const child = form_Data.get("child");
    const timestamp = + new Date();
    const query = new URLSearchParams({
      destination: redux_Keyword,
      dateRange,
      room: String(room),
      adult: String(adult),
      child: String(child),
      timestamp: String(timestamp)
    }).toString();

    set_Toggle(false);
    router.push(`/hotellist/${params.id}?${query}`)
  }

  // 11. F5刷新 - 重新搜尋(飯店列表)
  const pathName= usePathname();
  useEffect(() => {
    // 11.1 抓取當前 URL 上的搜尋參數
    const current_Search_Params = new URLSearchParams(window.location.search);
    console.log(current_Search_Params, "看看參數");
    // 11.2 檢查必要參數是否存在, 必須是飯店明細 /hotellist/${id}, 才給刷新
    if (
      pathName === `/hotellist/${params.id}` &&
      current_Search_Params.get("destination") && 
      current_Search_Params.get("dateRange") && 
      current_Search_Params.get("date_Start") && 
      current_Search_Params.get("date_End")
    ) {
      // 11.3 轉換成符合 Search_Params_Interface 的物件
      const search_Params: Search_Params_Interface = {
        // destination: current_Search_Params.get("destination") as string,
        destination: redux_Form_Search.keyword,
        dateRange: current_Search_Params.get("dateRange") as string,
        date_Start: current_Search_Params.get("date_Start") as string,
        date_End: current_Search_Params.get("date_End") as string,
        room: current_Search_Params.get("room") || "",
        adult: current_Search_Params.get("adult") || "",
        child: current_Search_Params.get("child") || "",
        rangeslider: current_Search_Params.get("rangeslider") || "",
        rating: current_Search_Params.get("rating") || "",
        bedType: current_Search_Params.get("bedtype")
          ? (current_Search_Params.get("bedtype") as string).split(",")
          : [],
        facility: current_Search_Params.get("facility")
          ? (current_Search_Params.get("facility") as string).split(",")
          : [],
      };
      // 11.4 呼叫 Refresh_Search_Hotel_List, 取得包含最新的 timestamp
      const new_Query_String = Refresh_Search_Hotel_Detail(search_Params)
      // 11.5 使用 router.replace 更新 URL（避免新增瀏覽歷史紀錄）
      router.replace(`/hotellist/${params.id}?${new_Query_String}`);

      // 11.6 更新 Redux - 指定飯店明細
      // if(the_Found_Hotel) {
      //   dispatch(update_Hotel_Detail(the_Found_Hotel));
      //   // 11.7 於 hotel_Detail頁面, 將 關鍵字 更新成 >> 飯店名
      //   // dispatch(updateKeyword(the_Found_Hotel?.hotel_Name as string))
      // }
    };
      
  },[router, dispatch])


  return <>
  
  {/* 返回上頁按鈕、Modla 彈跳<form>搜尋視窗 */}
  {/* <div className="bg-primary relative lg:hidden">
    <div className="flex flex-col py-2 cursor-pointer" onClick={show_FormSearch}>
      <p className="text-center text-white">{redux_Hotel_Detail?.hotel_Name}</p>
      <p className="text-center text-white">{redux_DateRange}</p>
    </div>

      <div className="absolute top-4 left-4 z-10 h-[56px]">
        <button type="button" className="" onClick={() => router.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>
    </div> */}
    {/* 返回上頁按鈕、Modla 彈跳<form>搜尋視窗 */}

    {/* Modal彈跳視窗 */}
      {/* <Modal isOpen={toggle} onClose={() => set_Toggle(false)}>
        <h2 className="text-xl font-bold mb-4 p-6">Change Keyword</h2>


        <form onSubmit={submit} className="flex flex-col gap-2 p-6">
          <Client_Input_Keyword></Client_Input_Keyword>
          <DateRangePicker></DateRangePicker>
          <Client_Input_Traveler></Client_Input_Traveler>
          <button type="submit" className="bg-primary rounded w-full py-2 px-4">
            Search
          </button>
        </form>
      </Modal> */}
    {/* Modal彈跳視窗 */}


    {/** 飯店卡片 */}
    <Hotel_Detail_Card the_Hotel={redux_Hotel_Detail}></Hotel_Detail_Card>
    {/** 飯店卡片 */}
  </>
}