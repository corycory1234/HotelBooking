'use client';
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateKeyword } from "../../store/form-Search/formSearchSlice";
import { RootState, AppDispatch } from "../../store/store";
import Datepicker from "react-tailwindcss-datepicker";// 1. 從 "react-tailwindcss-datepicker" 拉出 { DateValueType }, 做為 TS型別, 以免跳警告 
import { updateDateRange, update_Start_Date, update_End_Date } from "../../store/form-Search/formSearchSlice";
import useClickOutside from "@/hooks/useClickOutside";
import { addRoom, minusRoom, addAdult, minusAdult, addChild, minusChild  } from "../../store/form-Search/formSearchSlice";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Toaster_Notify from "../toaster/toaster";
// import hotel_List_Json from "@/fakeData/hotel_List.json";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";
import { DebouncedHotel } from "@/types/debouncedHotel";
import {updateRangeSlider, updateBedType, updateRating, updateFacility} from "@/store/form-Search/formSearchSlice";
import { useTranslations } from "next-intl";
import { OtherSVG } from "../client_Svg/client_Svg";

// 1. startDate - 高亮「今天」
const START_FROM = new Date();
START_FROM.setMonth(START_FROM.getMonth());

// 2. 最小日 -「今天」
const MIN_DATE = new Date();
MIN_DATE.setDate(MIN_DATE.getDate());

// 3. 最大日 - 只能在「一年」內選日期
const MAX_DATE = new Date();
MAX_DATE.setFullYear(MAX_DATE.getFullYear() +1);

export default function Form_Search_Pc () {
  // 4. 提取 Redux - formSeach表單 keyword
  const dispatch: AppDispatch = useDispatch();
  const keyword = useSelector((state: RootState) => state.formSearch!.keyword)

  // 5. Redux - DateRange 日曆範圍值 
  const storedDateRange = useSelector((state: RootState) => state.formSearch.dateRange)
  
  // 6. 本地日曆 - 初始值
  const [value, setValue] = useState<{startDate: Date | null, endDate: Date | null}>({
    startDate: null,
    endDate: null
  })

  // 7. 開始手動選日期
  const selectDate = (newValue: {startDate: Date | null, endDate: Date | null}) => {
    setValue(newValue);
    console.log(newValue, "手動點選後, 日歷之數據格式");
    const { startDate, endDate } = newValue;
    if(startDate && endDate) {
      // console.log(startDate, endDate, "看看日期");
      // const formattedStart = startDate.toISOString().split("T")[0];
      // const formattedEnd = endDate.toISOString().split("T")[0];
      // dispatch(updateDateRange(`${formattedStart} to ${formattedEnd}`));

      // toLocaleString()會是"2025/1/20 上午11:11:11", 再用split(" ")照著" 空白字串", 切出陣列 - 2個元素, 並取第0個
      const formatted_Start_Date = startDate.toLocaleString().split(" ")[0];
      const formatted_End_Date = endDate.toLocaleString().split(" ")[0];

      dispatch(updateDateRange(`${formatted_Start_Date} to ${formatted_End_Date}`))
      dispatch(update_Start_Date(formatted_Start_Date));
      dispatch(update_End_Date(formatted_End_Date));
    } else {
      dispatch(updateDateRange(null));
    }
  }

  // 8. 一進頁面, 日曆就綁「今天、明天」?
  useEffect(() => {
    if(storedDateRange) {
      const [start, end] = storedDateRange.split("to");
      setValue({
        startDate: new Date(start),
        endDate: new Date(end)
      })
    }
    // console.log(value);
  },[ storedDateRange])


  // 9. 提取Redux - formSearch 表單 Room房間量、Adult成人、Child小孩
  const room = useSelector((state: RootState) => state.formSearch!.room);
  const adult = useSelector((state: RootState) => state.formSearch!.adult);
  const child = useSelector((state: RootState) => state.formSearch!.child);

  // 10. 建立 ref 來追蹤 dropdown 元素
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  
  // 11. 打開 選人數清單
  const toggle_ShowDropDown = () => {
    setShowDropDown(!showDropDown)
  }

  // 12. 點外層, 隱藏 房間人數下拉選單
  useClickOutside(dropDownRef, () => setShowDropDown(false))

  // 13. Redux - 入住日、退房日
  const redux_Start_Date = useSelector((state: RootState) => state.formSearch.start_Date);
  const redux_End_Date = useSelector((state: RootState) => state.formSearch.end_Date);

  // 14. 路由
  const router = useRouter();
  
  // 15. 一般搜尋, 跳轉 /hotellist?搜尋參數
  const submit_Search = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
      const formData = new FormData(event?.currentTarget);
  
      const destination = formData.get("destination") as string;
      const dateRange = formData.get("datepicker") as string;
      const room = formData.get("room");
      const adult = formData.get("adult");
      const child = formData.get("child");
      const rangeslider = formData.getAll("rangeSlider");
      const rating = formData.getAll("rating");
      const bedType = formData.getAll("bedType") as string [];
      const facility = formData.getAll("facility") as string [];

      // 15.1 一般搜尋, 初始化「進階搜尋」
      dispatch(updateRangeSlider([100,9900]));
      dispatch(updateBedType([]));
      dispatch(updateRating([]));
      dispatch(updateFacility([]));
  
      // 15.2 吐司訊息, 防止沒輸入數據
      if(!destination || destination.trim() === ""){
        toast.error("Please Type Your Destination");
        return;
      };
      if(!dateRange || dateRange.trim() === "") {
        toast.error("Please Select DateRange");
        return;
      };
      
      // 15.2 飯店列表 API
      // const response = await fetch("/api/hotel_List", {
      //   method: "POST",
      //   headers: {"Content-Type": "application/json"},
      //   body: JSON.stringify({
      //     destination: destination,
      //     dateRange: dateRange,
      //     date_Start: redux_Start_Date,
      //     date_End: redux_End_Date,
      //     room: room,
      //     adult: adult,
      //     child: child,
      //     rangeslider: rangeslider,
      //     rating: rating,
      //     bedType: bedType,
      //     facility: facility,
      //     page: Number(searchParams.get("page"))
      //   })
      // });
      // if(!response.ok) {throw new Error(`Server error: ${response.status}`)};
      // const result = await response.json();
      // // 15.3 更新 Redux - 飯店列表
      // dispatch(update_Hotel_List(result.data))
        
      // 15.4 URL參數, 轉字串
      const timestamp = +new Date();
      const search_Params = new URLSearchParams({
        destination,
        dateRange,
        date_Start: redux_Start_Date as string,
        date_End: redux_Start_Date as string,
        room: String(room),
        adult: String(adult),
        child: String(child),
        rangeslider: String(rangeslider),
        timestamp: String(timestamp),
        bedtype: String(bedType),
        rating: String(rating),
        facility: String(facility),
        // page: String(result.currentPage)
        page: "1"
      }).toString()
  
          
      // 15.5 跳轉「飯店列表」
      router.push(`/hotellist?${search_Params}`);
      
    } catch (error) {
      console.log(error);
    }
  }

  // 16. F5刷新 - 重新搜尋(飯店列表)
  const searchParams = useSearchParams();
  const pathName= usePathname();
  // useEffect(() => {
  //   // 16.1 抓取當前 URL 上的搜尋參數
  //   const current_Search_Params = new URLSearchParams(window.location.search);
  //   console.log(current_Search_Params, "看看參數");
  //   // 16.2 檢查必要參數是否存在
  //   if (
  //     pathName === "/hotellist" &&
  //     current_Search_Params.get("destination") && 
  //     current_Search_Params.get("dateRange") && 
  //     current_Search_Params.get("date_Start") && 
  //     current_Search_Params.get("date_End")
  //   ) {
  //     // 16.3 轉換成符合 Search_Params_Interface 的物件
  //     const params: Search_Params_Interface = {
  //       destination: current_Search_Params.get("destination") as string,
  //       dateRange: current_Search_Params.get("dateRange") as string,
  //       date_Start: current_Search_Params.get("date_Start") as string,
  //       date_End: current_Search_Params.get("date_End") as string,
  //       room: current_Search_Params.get("room") || "",
  //       adult: current_Search_Params.get("adult") || "",
  //       child: current_Search_Params.get("child") || "",
  //       rangeslider: current_Search_Params.get("rangeslider") || "",
  //       rating: current_Search_Params.get("rating") || "",
  //       bedType: current_Search_Params.get("bedtype")
  //         ? (current_Search_Params.get("bedtype") as string).split(",")
  //         : [],
  //       facility: current_Search_Params.get("facility")
  //         ? (current_Search_Params.get("facility") as string).split(",")
  //         : [],
  //     };
  //     // 16.4 呼叫 Refresh_Search_Hotel_List, 取得包含最新的 timestamp
  //     const new_Query_String = Refresh_Search_Hotel_List(params)
  //     // 16.5 使用 router.replace 更新 URL（避免新增瀏覽歷史紀錄）
  //     router.replace(`/hotellist?${new_Query_String}`);

  //     // 16.6 匹配關鍵字, F5刷新再次搜尋
  //     const new_Hotel_List = hotel_List_Json.filter((hotel) => {
  //       return (
  //         hotel.hotel_Name?.toLowerCase().includes(params.destination.toLowerCase()) ||
  //         hotel.city?.toLowerCase().includes(params.destination.toLowerCase()) ||
  //         hotel.country?.toLowerCase().includes(params.destination.toLowerCase())
  //       );
  //     });

  //     // 16.7 更新 Redux - 飯店列表
  //     dispatch(update_Hotel_List(new_Hotel_List))
  //   };
      
  // },[router, dispatch])

  // 17. next-intl i18n 翻譯
  const t = useTranslations("FormSearch");

  // 18. Redux - 進階搜尋數據
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
  const redux_Facility = useSelector((state: RootState) => state.formSearch.rating);
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);

  // 18. 防抖搜尋 - 本地陣列狀態
  const timer_Ref = useRef<NodeJS.Timeout | null>(null);
  const [debounced_Hotel, set_Debounced_Hotel] = useState<DebouncedHotel[]>([]);

  // 19. 防抖搜尋 -函式
  const debounce_Search = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(timer_Ref.current) clearTimeout(timer_Ref.current);

    timer_Ref.current = setTimeout(async () => {
      const keyword = event.target.value.trim();
      if(!keyword) {
        set_Debounced_Hotel([]); 
        return;
      }

      try {
        const query_Params = new URLSearchParams({
          page: "1",
          city: "",
          country: "",
          minPrice: Array.isArray(redux_RangeSlider) ? String(redux_RangeSlider[0]) : String(redux_RangeSlider),
          maxPrice: Array.isArray(redux_RangeSlider) ? String(redux_RangeSlider[1]) : String(redux_RangeSlider),
          ratings: String(redux_Rating),
          q: String(event.target.value),
          facilities: String(redux_Facility?.join()),
          bedTypes: String(redux_BedType),
        }).toString();
        const hotel_List_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels?${query_Params}`;
        const response = await fetch(hotel_List_Url, {
          "method": "GET",
          headers: {"Content-Type": "application/json"},
          credentials: "include"
        });
        if(!response.ok) {throw new Error(`伺服器錯誤`)};
        const result = await response.json();

        set_Debounced_Hotel(result.data.data);
        set_Debounced_Boolean(true)

      } catch (error) {
        console.log(error);
      }
    },500)
  };

  // 20. 防抖搜尋 - 布林開關
  const [debounced_Boolean, set_Debounced_Boolean] = useState<boolean>(false);
  const debounced_Ref = useRef<HTMLDivElement>(null);
  const hidden_Debounced_Hotel_List = (keyword: string) => {
    dispatch(updateKeyword(keyword));
    set_Debounced_Boolean(false);
  };
  
  // 21. 防抖搜尋 - 布林開關 & 冒泡事件(點外層關掉) 
  useClickOutside(debounced_Ref, () => set_Debounced_Boolean(false));


  return <>
  <Toaster_Notify></Toaster_Notify>

  <form onSubmit={submit_Search} className="flex flex-col px-4 lg:flex-row lg:justify-center lg:items-center lg:bg-[#f3f3f3] gap-2 lg:px-20 lg:py-4 lg:relative">
    
    <div className="relative lg:basis-1/3 flex flex-col">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-2.5 right-2 text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <input type="text" placeholder={t ("Where are you going?")} 
      className="w-full py-2 px-4 rounded outline-none border border-gray bg-white lg:h-[44px]"
      onChange={(event) => {
        dispatch(updateKeyword(event.target.value))
        debounce_Search(event);
        }
      }
      value={keyword}
      name="destination"/>

    </div>

    <div className={`${debounced_Boolean === false ? 'hidden' : ''} flex flex-col lg:absolute lg:top-full lg:left-[80px] lg:w-1/2 rounded bg-white shadow-lg`} 
      ref={debounced_Ref}>
      {(debounced_Hotel.length >0 && debounced_Boolean === true) ? debounced_Hotel.map((hotel, index) => {
        return index <5 && <div className="flex gap-2 p-2 border-b border-softGray hover:bg-[#f3f3f3] cursor-pointer" 
        key={index}
        onClick={() => hidden_Debounced_Hotel_List(hotel.hotel_Name as string)}>
            <OtherSVG name="hotel" className="w-5 h-auto"></OtherSVG>
            <p>{hotel.hotel_Name}, {hotel.city}, {hotel.country}</p>
          </div>
        })
      : <></>
      }
    </div>


    <div className="lg:basis-1/3">
      <Datepicker
        i18n={navigator.language}
        primaryColor={"teal"}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        popoverDirection="down"
        containerClassName="w-full lg:inline-block lg:flex"
        inputClassName="w-full py-2 outline-none border border-gray rounded px-4 lg:w-full lg:h-[44px]"
        toggleClassName="absolute bg-primary rounded-r text-white right-4 h-[42px] lg:h-[44px] px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed
        lg:relative lg:align-middle lg:-left-1"
        inputId="datepicker"
        inputName="datepicker"
        required={true}
        readOnly={true}
        startFrom={START_FROM}
        separator="to" 
        value={value} 
        onChange={(newValue: any) => selectDate(newValue)}
      />

      {/* 隱藏的輸入框，用於表單提交 */}
      <input 
        type="hidden" 
        name="datepicker" 
        value={storedDateRange || ""}
      ></input>
    </div>

{/** 旅客人數、房間數 */}
  <div className="lg:basis-1/4">

    {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}
      <input type="hidden" name="room" value={room} />
      <input type="hidden" name="adult" value={adult} />
      <input type="hidden" name="child" value={child} />
    {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}

    <div className="relative w-full" ref={dropDownRef}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-2 lg:top-2 right-2 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <button className="w-full py-2 px-4 lg:pt-1 lg:flex lg:gap-2 rounded outline-none border border-gray text-left bg-white lg:h-[44px]"
          onClick={toggle_ShowDropDown}
          type="button">
          <p className="lg:hidden">
            {`${room} ${t ("Room")} – ${adult} ${t ("Adult")}, ${child} ${t ("Child")}`}
          </p>

          <div className="hidden lg:flex lg:flex-col lg:text-[13px]">
            <div className="lg:flex lg:gap-1">
              <p>{adult} {t ("Adult")},</p>
              <p>{child} {t ("Child")}</p>
            </div>
            <p className="text-xs lg:text-[13px] text-gray">{room} {t ("Room")}</p>
          </div>
        </button>

      {/* DropDown 選人清單 */}
        { showDropDown &&
          <div className="absolute top-full w-full bg-white z-10 flex flex-col gap-2 pl-4 pr-2 py-2 rounded border border-gray mt-2">
            {/* 房間 */}
            <div className="flex justify-between items-center py-2 border-b border-gray">
              <p>{room} {t ("Room")}</p>
              <div className="flex gap-4">
                <button onClick={() => dispatch(minusRoom())} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${room<=1 ? 'text-gray' : 'text-primary'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>

                <button onClick={() => dispatch(addRoom())} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* 房間 */}

            {/* 成人 */}
            <div className="flex justify-between items-center py-2 border-b border-gray">
              <p>{adult} {t ("Adult")}</p>
              <div className="flex gap-4">
                <button onClick={() => dispatch(minusAdult())} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${adult<=1 ? 'text-gray' : 'text-primary'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>

                <button onClick={() => dispatch(addAdult())} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* 成人 */}

            {/* 小孩 */}
            <div className="flex justify-between items-center py-2 border-b border-gray">
              <p>{child} {t ("Child")}</p>
              <div className="flex gap-4">
                <button onClick={() => dispatch(minusChild())} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${child<=0 ? 'text-gray' : 'text-primary'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>

                <button onClick={() => dispatch(addChild())} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* 小孩 */}

          </div>
        }
      {/* DropDown 選人清單 */}
    </div>
  </div>
{/** 旅客人數、房間數 */}


{/** Submit 搜尋送出按鈕 */}
    <div className="lg:basis-1/12">
      <button className="bg-primary text-white rounded w-full h-[42px] py-1 px-2 lg:mx-auto lg:h-[44px]">{t ("Search")}</button>
    </div>
{/** Submit 搜尋送出按鈕 */}

  </form>
  
  
  
  
  </>
}