'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import hotel_List_Json from "../../fakeData/hotel_List.json";
import { OtherSVG } from "../client_Svg/client_Svg";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { update_My_Collection, add_My_Collection, delete_My_Collection } from "@/store/my_Collection/my_Collection_Slice";
import { update_Hotel_List, to_Full_Heart, to_Empty_Heart  } from "@/store/hotel_List/hotel_List_Slice";
import AdvancedSearchPc from "../advancedSearch/advancedSearchPc";
import StarRating from "../starrating/star-Rating";
import { FacilitySVG } from "../client_Svg/client_Svg";
import how_Many_Nights from "@/utils/how_Many_Nights";
import { useSearchParams } from "next/navigation";
import Not_Found from "../not_Found/not_Found";
import Filter_Button from "../filter_Button";
import Half_Modal from "../modal/half-modal";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Image from "next/image";
import useClickOutside from "@/hooks/useClickOutside";

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
  // const timeStamp = + new Date();
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility);
  const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List2.hotel_List);
  const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);
  const redux_Access_Token = useSelector((state: RootState) => state.access_Token.data.tokens.access_token);
  const redux_Collection_List = useSelector((state: RootState) => state.my_Collection.collection_List)


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
      timestamp: String(timestamp),
      bedType: String(redux_BedType),
      rating: String(redux_Rating),
      facility: String(redux_Facility)
    }).toString()

    if(result) {
      // console.log(result, "指定飯店 - 所有房型");
      router.push(`/hotellist/${hotel_Id}?${query}`)
    } else {
      alert("沒找到指定飯店 - 所有房型")
    }
  }

  // 3. 新增收藏飯店
  const add_Collection = async (item: add_Hotel_Detail_Interface) => {
    // 3.1 沒登入, 不給收藏
    if(redux_Access_Token === '') { 
      toast.error("Please Login First", {icon: "⚠️", duration: 2000});
      return;
    };
    const add_Collection_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/favorites/${item.hotel_Id}`;
    try {
      // 3.2 暫時 先切換愛心 優先 打API
      dispatch(add_My_Collection({hotel_Id: item.hotel_Id as string, isCollected: item.isCollected}));
      const response = await fetch(add_Collection_Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${redux_Access_Token}`
        },
        credentials: "include",
        body: JSON.stringify({
          hotelId: item.hotel_Id
        }),
      });
      if(!response.ok) {throw new Error("SERVER ERROR~~!")};
    } catch (error) {
      console.log(error);
    }

    // dispatch(to_Full_Heart(hotel));
    // dispatch(add_My_Collection(hotel));
  }

  // 4. 刪除收藏飯店
  const delete_Collection = async (item: add_Hotel_Detail_Interface) => {
    // 4.1 沒登入, 不給收藏
    if(redux_Access_Token === '') { 
      toast.error("Please Login First", {icon: "⚠️", duration: 2000})
      return;
    };
    const delete_Collectiono_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/favorites/${item.hotel_Id}`;
    try {
      // 4.2 暫時 先切換愛心 優先 打API
      dispatch(delete_My_Collection({hotel_Id: item.hotel_Id as string, isCollected:item.isCollected}));
      const response = await fetch(delete_Collectiono_Url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${redux_Access_Token}`
        },
        credentials: "include",
        body: JSON.stringify({
          hotelId: item.hotel_Id
        })
      });
      if(!response.ok) {throw new Error("SERVER ERROR~~!")};
    } catch (error) {
      console.log(error);
    }
    // dispatch(to_Empty_Heart(hotel));
    // dispatch(delete_My_Collection(hotel));
  }

  // 5. sort排序 - 布林值
  const [formSort, set_FormSort] = useState<boolean>(false);

  // 6. sort排序 - <input tpye="radio" value="本地數據">
  const [sort_Value, set_Sort_Value] = useState<string>("")

  // 8. Skeleton動畫 - 延遲2秒 (這邊待API寫好, 於useEffect)
  const [show_Hotel_List, set_Show_Hotel_List] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const timestamp = searchParams.get("timestamp");
  const current_Page_Params = searchParams.get("page");
  // useEffect(() => {
  //   set_Show_Hotel_List(false) // 第2次進頁面, 從 true >> false
  //   const timer = setTimeout(() => {
  //     set_Show_Hotel_List(true);
  //   }, 2500);
  //   return () => clearTimeout(timer);
  // },[searchParams])

  // 9. Skeleton動畫 - 佔位符
  const Placeholder_Card = () => {
    return <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray lg:w-1/3"></div>
        
        <div className="flex flex-col gap-2 lg:w-2/3">
          <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded lg:w-full"></h3>
          <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded lg:w-full"></h3>
          <h3 className="hidden animate-pulse bg-softGray w-1/2 h-6 rounded lg:block lg:w-full"></h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray lg:w-1/3"></div>
        
        <div className="flex flex-col gap-2 lg:w-2/3">
          <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded lg:w-full"></h3>
          <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded lg:w-full"></h3>
          <h3 className="hidden animate-pulse bg-softGray w-1/2 h-6 rounded lg:block lg:w-full"></h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="w-full h-[200px] object-cover object-top rounded animate-pulse bg-softGray lg:w-1/3"></div>
        
        <div className="flex flex-col gap-2 lg:w-2/3">
          <h3 className="animate-pulse bg-softGray w-3/4 h-6 rounded lg:w-full"></h3>
          <h3 className="animate-pulse bg-softGray w-1/2 h-6 rounded lg:w-full"></h3>
          <h3 className="hidden animate-pulse bg-softGray w-1/2 h-6 rounded lg:block lg:w-full"></h3>
        </div>
      </div>
    </div>
  }


  // 10. Sort 彈跳Modal開關 (手機版)
  const [formSort_Mobile, setFormSort_Mobile] = useState<boolean>(false);

  // 11. Sort 傳遞<input type="radio"> 之 Value 與 傳遞函式 set_Sort_Value (手機版)
  const [sort_Value_Mobile, set_Sort_Value_Mobile] = useState("");

  // 12. 前端 - 飯店列表 API
  // const fetch_Hotel_List = async (page: number) => {
  //   try {
  //     const response = await fetch("/api/hotel_List", {
  //       method: "POST",
  //       headers: {"Content-Type": "application/json"},
  //       body: JSON.stringify({
  //         destination: redux_Destination,
  //         dateRange: redux_DateRange,
  //         date_Start: redux_Date_Start,
  //         date_End: redux_Date_End,
  //         room: redux_Room,
  //         adult: redux_Adult,
  //         child: redux_Child,
  //         rangeslider: redux_RangeSlider,
  //         rating: redux_Rating,
  //         bedType: redux_BedType,
  //         facility: redux_Facility,
  //         page: page
  //       })
  //     });
  //     if(!response.ok) {
  //       throw new Error(`Server error: ${response.status}`)
  //     };
  //     const result = await response.json();
  //     dispatch(update_Hotel_List(result.data));
  //     set_Current_Page(result.currentPage);
  //     set_Total_Hotel(result.total);
  //     set_Total_Pages(result.totalPages)



  //     // 12.1 URL參數, 轉字串
  //     // const timestamp = +new Date();
  //     const search_Params = new URLSearchParams({
  //       destination: redux_Destination,
  //       dateRange: redux_DateRange as string,
  //       date_Start: redux_Date_Start as string,
  //       date_End: redux_Date_End as string,
  //       room: String(redux_Room),
  //       adult: String(redux_Adult),
  //       child: String(redux_Child),
  //       rangeslider: String(redux_RangeSlider),
  //       timestamp: String(timestamp),
  //       bedtype: String(redux_BedType),
  //       rating: String(redux_Rating),
  //       facility: String(redux_Facility),
  //       page: String(result.currentPage)
  //     }).toString()

  //     // 12.2 跳轉「飯店列表」
  //     router.push(`/hotellist?${search_Params}`);

  //   } catch (error) {
  //     console.log(error, "飯店列表API失敗");
  //   }
  // };

  // 13.  只要timeStamp(URL字串, 並非 + new Date())有變, 
  // 13.1 就重打 飯店列表API (用於一般搜尋、進階搜尋, 跳轉/hotellist)
  useEffect(() => {
    fetch_Hotel_List_Backend(Number(current_Page_Params));
  },[timestamp])


  // 14. 後端 - 飯店列表API
  const fetch_Hotel_List_Backend = async (page: number) => {
    try {
      // 14.1 Skeleton動畫 - 開
      set_Show_Hotel_List(false)

      const query_Params = new URLSearchParams({
        page: String(page),
        city: "",
        country: "",
        minPrice: Array.isArray(redux_RangeSlider) ? String(redux_RangeSlider[0]) : String(redux_RangeSlider),
        maxPrice: Array.isArray(redux_RangeSlider) ? String(redux_RangeSlider[1]) : String(redux_RangeSlider),
        ratings: String(redux_Rating),
        q: redux_Destination,
        facilities: String(redux_Facility?.join()),
        bedTypes: String(redux_BedType),
      }).toString();

      const hotel_List_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels?${query_Params}`;
      const response = await fetch(hotel_List_Url, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: 'include'
      });
      if(!response.ok) {throw new Error(`伺服器錯誤`)};
      const result = await response.json();
      // console.log(result, "飯店列表API - 返回數據");

      dispatch(update_Hotel_List(result.data.data));
      set_Current_Page(result.data.page);
      set_Total_Hotel(result.data.total);
      set_Total_Pages(result.data.totalPages);



      // 14.1 前端自己的URL (這會造成再一次路由導向, 導致i18n會從 zh-TW >> en >> 又切回 zh-TW )
      // const search_Params = new URLSearchParams({
      //   destination: redux_Destination,
      //   dateRange: redux_DateRange as string,
      //   date_Start: redux_Date_Start as string,
      //   date_End: redux_Date_End as string,
      //   room: String(redux_Room),
      //   adult: String(redux_Adult),
      //   child: String(redux_Child),
      //   rangeslider: String(redux_RangeSlider),
      //   timestamp: String(timestamp),
      //   bedtype: String(redux_BedType),
      //   rating: String(redux_Rating),
      //   facility: String(redux_Facility),
      //   page: String(result.data.page)
      // }).toString()
      // router.push(`/hotellist?${search_Params}`);
      
      // 14.5 Skeleton動畫 -關
      set_Show_Hotel_List(true)
    } catch (error) {
      console.log(error, "飯店列表API失敗");
    }
  }

  // 14. Pagination 分頁
  const [current_Page, set_Current_Page] = useState<number>(1);
  const [total_Hotel, set_Total_Hotel] = useState<number>(0);
  const [total_Pages, set_Total_Pages] = useState<number>(1);
  
  // 15. 上一頁
  const previous_Page = () => {
    set_Current_Page((prevPage: number) => {
      if(prevPage === 1) {
        return prevPage;
      } else {
        const newPage =  prevPage > 1 ? prevPage - 1 : 1;
        // fetch_Hotel_List(newPage);
        fetch_Hotel_List_Backend(newPage);
        return newPage;
      }
    });
  };

  // 16. 下一頁
  const next_Page = () => {
    set_Current_Page((prevPage: number) => {
      if(prevPage === total_Pages) {
        return prevPage;
      } else {
        const newPage =  prevPage < total_Pages ? prevPage + 1 : prevPage;
        // fetch_Hotel_List(newPage);
        fetch_Hotel_List_Backend(newPage);
        return newPage;
      }
    });
  };

  // 17. next-intl i18n翻譯
  const t = useTranslations("AdvancedSearch");
  const t_HotelCard = useTranslations("HotelCard");


  // 18. 被 sorted 飯店列表, 不可拿 redux_Hotel_List 去排序, 因為沒有寫 Redux - Action。 
  // 18.1 再者, 這種偏簡單的排序, 直接寫在前端元件就好, 沒必要再回去更新 Redux, 減少 Redux boilerplate
  // 18.2 先忽略2點與2.1點 ↑ 這邊切太多元件, 設計沒做好。
  // 18.3 最後, 再將重新排序後的飯店列表, dispatch傳數據給 Redux 飯店列表...這邊設計沒做好, 暫時只好去變動最原始的Redux - 飯店列表
  let sorted_Hotel_List: add_Hotel_Detail_Interface[] = [] 


  // 19. 排序 - Switch Case 綜合函式
  const sortHotels = (sort_Option: string) => {
    switch(sort_Option) {
      case "priceLow":
        sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (a.price as number) - (b.price as number)); // 2. 排序 - 最低價 >> 最高價
        break;
      case "priceHigh":
        sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (b.price as number) - (a.price as number)); // 3. 排序 - 最高價  >> 最低價
        break;
      case "ratingHigh":
        sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (b.totalRating as number) - (a.totalRating as number)); // 4. 排序 - 最低評價 >> 最高評價
        break;
      case "ratingLow":
        sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (a.totalRating as number) - (b.totalRating as number)); // 5. 排序 - 最高評價 >> 最低評價
        break;
    };
    set_Sort_Value(sort_Option); // <input type="radio"> 高亮
    // console.log(sort_Value, 123);
    dispatch(update_Hotel_List(sorted_Hotel_List));
    setFormSort_Mobile(false);
    set_FormSort(false);
  };

  // 20. Sort排序, 點外層, 關閉
  const sortFormRef = useRef<HTMLFormElement>(null);
  useClickOutside(sortFormRef, () => set_FormSort(false));

  // 21. Vercel架在美國, 造成<Image>渲染會比文字還慢, 用布林搭配onLoad事件, 來判斷圖片是否載入完成
  const [isLoadingImg, setIsLoadingImg] = useState<boolean>(true);
  

  return <>
  {/************ 手機版|PC桌機 - 沒找到, 就<Not_Found> ************/}
    {(redux_Hotel_List?.length <=0 && show_Hotel_List === true) ? <Not_Found you_Have_No_Bookings="Hotels Not Found"></Not_Found>
    
    :
    <>
    {/************ 手機版 - Filter、熱門搜尋條件 ************/}
      <div className="sticky top-[72px] left-0 right-0 bg-white z-40 border-b border-gray lg:hidden lg:static">
        <Filter_Button></Filter_Button>
      </div>
    {/************ 手機版 - Filter、熱門搜尋條件 ************/}
      


    <main className="p-4">

      <div className="flex items-center justify-between pb-4 lg:hidden">
        <p className="text-sm">{redux_Hotel_List?.length} hotels</p>
      {/************ 手機版 - ↑↓Sort排序 ************/}
        <div className="flex items-center gap-1 border border-gray rounded px-2 py-1 cursor-pointer" onClick={()=> setFormSort_Mobile(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
          <span>{t ("Sort")}</span>
        </div>
        {/* ↑↓Sort 排序 - 彈跳Modal  */}
        <Half_Modal isOpen={formSort_Mobile} onClose={() => setFormSort_Mobile(false)} 
          sort_Value={sort_Value_Mobile} 
          set_Sort_Value={set_Sort_Value_Mobile}>

        {/* ↑↓Sort 排序 - 彈跳Modal  */}
        <div className="flex flex-col pt-12">
          <p className="px-4 pb-4 text-lg font-bold">{t ("Sort By")}</p>
          <form action="" className="flex flex-col justify-between gap-4">

              <div className="flex justify-between px-4">
                <label htmlFor="priceLow">{t (`Price (Low ~ High)`)}</label>
                <input type="radio" name="sort" id="priceLow" value="priceLow" onChange={() => sortHotels("priceLow")}
                checked={sort_Value === "priceLow"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="priceHigh">{t (`Price (High ~ Low)`)}</label>
                <input type="radio" name="sort" id="priceHigh" value="priceHigh" onChange={() => sortHotels("priceHigh")}
                checked={sort_Value === "priceHigh"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="ratingHigh">{t (`Rating (High ~ Low)`)}</label>
                <input type="radio" name="sort" id="ratingHigh" value="ratingHigh" onChange={() => sortHotels("ratingHigh")}
                checked={sort_Value === "ratingHigh"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="ratingLow">{t (`Rating (Low ~ High)`)}</label>
                <input type="radio" name="sort" id="ratingLow" value="ratingLow" onChange={() => sortHotels("ratingLow")}
                checked={sort_Value === "ratingLow"}/>
              </div>

          </form>
        </div>
        {/* ↑↓Sort 排序 - 彈跳Modal  */}

        </Half_Modal>
        {/* ↑↓Sort 排序 - 彈跳Modal  */}
      {/************ 手機版 - ↑↓Sort排序 ************/}
      </div>
    
    
  {/************ PC桌機版 - 以下大多屬於PC桌機 ************/}
    <div className="lg:flex lg:justify-between lg:mt-[167px] lg:px-16">

      {/********** PC桌機版 - Filter過濾條件 **********/}
      <div className={`hidden lg:block lg:w-1/4 border border-softGray rounded
        lg:sticky lg:top-[184px] self-start`}>
        <AdvancedSearchPc></AdvancedSearchPc>
      </div>
      {/********** PC桌機版 - Filter過濾條件 **********/}


      {/** 飯店列表卡片 */}
      <div className="lg:w-2/3 lg:ml-5 lg:flex-1 lg:flex lg:flex-col lg:gap-4 lg:relative">
        

      {!show_Hotel_List ? <Placeholder_Card></Placeholder_Card> 
        :
        <>
        {/** Sort排序 - PC */}
        <div className="hidden lg:flex lg:w-[14%] justify-center items-center gap-1 border border-primary rounded-full px-2 py-1 cursor-pointer" onClick={()=> set_FormSort(!formSort)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-primary" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
          <span className="text-primary">{t ("Sort")}</span>
        </div>
        
        {/** Sort排序 - 絕對定位<form> - PC */}
        <div className="hidden lg:block">
          {formSort === true && 
              <form className="absolute top-10 z-20 border rounded border-softGray bg-white flex flex-col gap-2 p-4 w-[40%]"
              ref={sortFormRef}>
        
                  <div className="flex justify-between items-center ">
                    <label htmlFor="priceLow">{t (`Price (Low ~ High)`)}</label>
                    <input type="radio" name="sort" id="priceLow" value="priceLow" onChange={() => sortHotels("priceLow")}
                    checked={sort_Value === "priceLow"}/>
                  </div>
                  <div className="flex justify-between items-center ">
                    <label htmlFor="priceHigh">{t (`Price (High ~ Low)`)}</label>
                    <input type="radio" name="sort" id="priceHigh" value="priceHigh" onChange={() => sortHotels("priceHigh")}
                    checked={sort_Value === "priceHigh"}/>
                  </div>
                  <div className="flex justify-between items-center ">
                    <label htmlFor="ratingHigh">{t (`Rating (High ~ Low)`)}</label>
                    <input type="radio" name="sort" id="ratingHigh" value="ratingHigh" onChange={() => sortHotels("ratingHigh")}
                    checked={sort_Value === "ratingHigh"}/>
                  </div>
                  <div className="flex justify-between items-center ">
                    <label htmlFor="ratingLow">{t (`Rating (Low ~ High)`)}</label>
                    <input type="radio" name="sort" id="ratingLow" value="ratingLow" onChange={() => sortHotels("ratingLow")}
                    checked={sort_Value === "ratingLow"}/>
                  </div>
              </form>
              
          }
        </div>
        {/** Sort排序 - 絕對定位<form> - PC */}
        {/** Sort排序 - PC */}
        
        {/** 總共OO間飯店 - PC */}
        <p className="hidden lg:block lg:border-b lg:border-softGray lg:py-2">{redux_Hotel_List?.length} Hotels</p>
        {/** 總共OO間飯店 - PC*/}
        
        {redux_Hotel_List?.map((item) => {

        // Redux - 收藏飯店陣列, 與 Redux - 飯店陣列匹配, 找出以加入到我的最愛
        const the_Collection = redux_Collection_List.find((collection) => collection.hotel_Id === item.hotel_Id);
        const is_Collected = the_Collection ? the_Collection.isCollected : false;

        return <div key={item.hotel_Id} className="py-4 lg:rounded-none lg:border-b lg:border-softGray">
          <article className="bg-white rounded-lg overflow-hidden shadow-sm
          lg:flex lg:gap-4 lg:relative lg:rounded-none lg:shadow-none">
        
            {/* Swiper 飯店圖片 */}
            <div className="lg:w-1/3">
              <Swiper slidesPerView={1.25} spaceBetween={5} loop={true} 
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation]}
                breakpoints={{1024: {slidesPerView: 1, loop:false,}, }}
                className="navigation-go-center"
                >
                {item.hotel_Image_List.map((img, index) => {
                  return <SwiperSlide key={index}>
                    {isLoadingImg && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}

                    <div className="relative w-full h-[200px]">
                      <Image 
                      // width={200} height={200}
                      fill
                      priority={true}
                      unoptimized
                      src={img.url} alt={img.description} 
                      className={`object-cover rounded 
                      ${isLoadingImg ? 'animate-pulse bg-softGray w-1/2 h-6 rounded lg:block lg:w-full' : ''}`} 
                      onLoad={() => setIsLoadingImg(false)}/>
                    </div>
                  </SwiperSlide>
                })}
              </Swiper>
            </div>
            {/* Swiper 飯店圖片 */}
        
        
            <div className="p-4 lg:2/3 lg:flex-1 lg:p-0 lg:flex lg:flex-col lg:gap-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <div className="hidden lg:block">
                    <StarRating ranking={item.totalRating as number}></StarRating>
                  </div>
                  <h3 className="font-semibold">{item.hotel_Name}</h3>
                  {/* <p className="text-sm text-gray-500 mt-1">{item.distance}</p> */}
                  <p className="text-sm text-gray-500">{item.city}, {item.country}</p>
                </div>
        
                <div className="w-1/3 flex flex-col gap-2 justify-center items-center lg:items-end">
                  <div className="flex items-center gap-1 bg-[#f3f3f3] text-custom px-2 py-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-yellow-500">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">
                      {item.totalRating}
                    </span>
                  </div>
        
                  {/** 飯店最低價前 - PC */}
                  <p className="hidden lg:block text-xl font-semibold">$ {item.price}</p>
                  {/** 飯店最低價前 - PC */}
                  
                  {/** 人數、幾間房 - PC */}
                  <div className="hidden lg:flex flex-col">
                    <p className="lg:text-sm lg:text-[#6D6D6D]">  
                      {redux_Adult + redux_Child} {t_HotelCard ("Guest")}
                    </p>
                    <p className="lg:text-sm lg:text-[#6D6D6D]">
                      {how_Many_Nights(redux_Date_Start as string, redux_Date_End as string)} {t_HotelCard ("Nights")}
                    </p>
                  </div>
                  {/** 人數、幾間房 - PC */}
        
                  {/** 我的收藏 - 愛心 */}
                  {is_Collected === false ? <>
                    <div className="cursor-pointer lg:absolute lg:left-[28%] lg:top-[5%] lg:z-[1]">
                      <OtherSVG name="emptyheart" className="w-5 h-auto"
                      onClick={() => add_Collection(item)}></OtherSVG>
                    </div>
                  </>
                  : <>
                    <div className="cursor-pointer lg:absolute lg:left-[28%] lg:top-[5%] lg:z-[1]">
                      <OtherSVG name="fullheart" className="w-5 h-auto"
                      onClick={() => delete_Collection(item)}></OtherSVG>
                    </div>
                  {/** 我的收藏 - 愛心 */}
                  
                  </>
                  }
                </div>
        
        
              </div>
        
              {/** 飯店設施 */}
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hidden lg:grid lg:grid-cols-5 lg:gap-x-0 lg:gap-y-3 lg:mt-0">
                {item.facility_List?.map((facility, index) => {
                  return <div className="lg:flex lg:gap-1" key={index}>
                      {index <6 && <>
                        <FacilitySVG name={facility} className="hidden lg:block lg:w-5 lg:h-auto"></FacilitySVG>
                        <span className="text-xs px-2 py-1 bg-[#f3f3f3] rounded lg:bg-transparent lg:p-0">
                          {facility.charAt(0).toUpperCase() + facility.slice(1)}
                        </span>
                        </>
                        }
                  </div>
                })}
              </div>
              {/** 飯店設施 */}
        
              
              <div className="flex items-center justify-between mt-4 lg:mt-0 lg:justify-end lg:pb-2">
                <div className="lg:hidden">
                  <span className="text-xl font-semibold">$ {item.price}</span>
                  <span className="text-sm text-gray-500">{t_HotelCard ("/night")}</span>
                </div>
                {/* <Link href={`/hotellist/${item.id}`}> */}
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                  onClick={() => check_Hotel_RoomType_List(item.hotel_Id as string)}>
                  {t_HotelCard ("Book Now")}
                </button>
                {/* </Link> */}
              </div>
        
        
            </div>
          </article>
        </div>
        })}
        
      {/**********  Pagination 分頁 **********/}
        <ul className="flex justify-center items-center gap-2 py-4 lg:py-0">
          <li className={`${current_Page === 1 ? 'disabled text-softGray' : 'hover:bg-primary hover:rounded hover:text-white'} p-2 cursor-pointer`}
            onClick={previous_Page}>{"＜"}</li>
          {Array.from({length: total_Pages}).map((_, index) => {
            return <li key={index+1} className={`${current_Page === index+1 ? 'bg-primary rounded text-white' : ''} py-2 px-3 font-semibold cursor-pointer`}
              onClick={() => {set_Current_Page(index+1),
              // fetch_Hotel_List(index+1)
              fetch_Hotel_List_Backend(index+1)
            }
            }>{index +1}</li>
          })}
          <li className={`${current_Page === total_Pages ? 'disabled text-softGray' : 'hover:bg-primary hover:rounded hover:text-white'} p-2 cursor-pointer`}
            onClick={next_Page}>{"＞"}</li>
        </ul>
      {/**********  Pagination 分頁 **********/}

        
        </>

      }


      </div>
      {/** 飯店列表卡片 */}
    </div>
  {/************ PC桌機版 - 以下大多屬於PC桌機 ************/}
    
    </main>
    </>
  } 
</>
}