'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import hotel_List_Json from "../../fakeData/hotel_List.json";
import { OtherSVG } from "../client_Svg/client_Svg";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { add_My_Collection, delete_My_Collection } from "@/store/my_Collection/my_Collection_Slice";
import { update_Hotel_List, to_Full_Heart, to_Empty_Heart  } from "@/store/hotel_List/hotel_List_Slice";
import Advanced_Search_Pc from "../advanced_Search/advanced_Search_Pc";
import StarRating from "../starrating/star-Rating";
import { FacilitySVG } from "../client_Svg/client_Svg";
import how_Many_Nights from "@/utils/how_Many_Nights";
import { useSearchParams } from "next/navigation";
import Not_Found from "../not_Found/not_Found";
import Client_Filter_Button from "../client-Filter-Button";
import Half_Modal from "../modal/half-modal";

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

  // 5. sort排序 - 布林值
  const [formSort, set_FormSort] = useState<boolean>(false);

  // 6. sort排序 - <input tpye="radio" value="本地數據">
  const [sort_Value, set_Sort_Value] = useState<string>("priceLow")

  // 7. 排序 - Switch Case 綜合函式
  let sorted_Hotel_List: add_Hotel_Detail_Interface[] = [] 
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
    console.log(sort_Value, 123);
    dispatch(update_Hotel_List(sorted_Hotel_List));
    set_FormSort(false) // 選完 <input type="radio">, 關 modal彈跳
  };


  // 8. Skeleton動畫 - 延遲2秒 (這邊待API寫好, 於useEffect)
  const [show_Hotel_List, set_Show_Hotel_List] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const timestamp = searchParams.get("timestamp");

  useEffect(() => {
    set_Show_Hotel_List(false) // 第2次進頁面, 從 true >> false
    const timer = setTimeout(() => {
      set_Show_Hotel_List(true);
    }, 1500);
    return () => clearTimeout(timer);
  },[timestamp])

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

  // 12. 飯店列表 API
  const fetch_Hotel_List = async () => {
    try {
      const response = await fetch("/api/hotel_List", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          destination: redux_Destination,
          dateRange: redux_DateRange,
          date_Start: redux_Date_Start,
          date_End: redux_Date_End,
          rangeslider: redux_RangeSlider,
          rating: redux_Rating,
          bedType: redux_BedType,
          facility: redux_Facility
        })
      });
      if(!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      };
      const result = await response.json();
      dispatch(update_Hotel_List(result.data));
    } catch (error) {
      console.log(error, "飯店列表API失敗");
    }
  };
  useEffect(() => {
    fetch_Hotel_List();
  },[])
  

  return <>
  {/************ 手機版|PC桌機 - 沒找到, 就<Not_Found> ************/}
    {redux_Hotel_List.length <=0 ? <Not_Found you_Have_No_Bookings="Hotels Not Found"></Not_Found>
    
    :
    <>
    {/************ 手機版 - Filter、熱門搜尋條件 ************/}
      <div className="sticky top-[72px] left-0 right-0 bg-white z-40 border-b border-gray lg:hidden">
        <Client_Filter_Button></Client_Filter_Button>
      </div>
    {/************ 手機版 - Filter、熱門搜尋條件 ************/}
      


    <main className="p-4">

      <div className="flex items-center justify-between pb-4 lg:hidden">
        <p className="text-sm">{redux_Hotel_List.length} hotels</p>
      {/************ 手機版 - ↑↓Sort排序 ************/}
        <div className="flex items-center gap-1 border border-gray rounded px-2 py-1 cursor-pointer" onClick={()=> setFormSort_Mobile(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
          <span>Sort</span>
        </div>
        {/* ↑↓Sort 排序 - 彈跳Modal  */}
        <Half_Modal isOpen={formSort_Mobile} onClose={() => setFormSort_Mobile(false)} 
          sort_Value={sort_Value_Mobile} 
          set_Sort_Value={set_Sort_Value_Mobile}>
        </Half_Modal>
        {/* ↑↓Sort 排序 - 彈跳Modal  */}
      {/************ 手機版 - ↑↓Sort排序 ************/}
      </div>
    
    
  {/************ PC桌機版 - 以下大多屬於PC桌機 ************/}
    <div className="lg:flex lg:justify-between lg:mt-[167px] lg:px-16">

      {/** Filter過濾條件 - PC */}
      <div className={`hidden lg:block lg:w-1/4 border border-softGray rounded
        lg:sticky lg:top-[184px] self-start`}>
        <Advanced_Search_Pc></Advanced_Search_Pc>
      </div>
      {/** Filter過濾條件 - PC */}


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
          <span className="text-primary">Sort</span>
        </div>
        
        {/** Sort排序 - 絕對定位<form> - PC */}
        <div className="hidden lg:block">
          {formSort === true && 
              <form className="absolute top-10 z-20 border rounded border-softGray bg-white flex flex-col gap-2 p-4 w-[40%]">
        
                  <div className="flex justify-between items-center ">
                    <label htmlFor="priceLow">{`Price (Low ~ High)`}</label>
                    <input type="radio" name="sort" id="priceLow" value="priceLow" onChange={() => sortHotels("priceLow")}
                    checked={sort_Value === "priceLow"}/>
                  </div>
                  <div className="flex justify-between items-center ">
                    <label htmlFor="priceHigh">{`Price (High ~ Low)`}</label>
                    <input type="radio" name="sort" id="priceHigh" value="priceHigh" onChange={() => sortHotels("priceHigh")}
                    checked={sort_Value === "priceHigh"}/>
                  </div>
                  <div className="flex justify-between items-center ">
                    <label htmlFor="ratingHigh">{`Rating (High ~ Low)`}</label>
                    <input type="radio" name="sort" id="ratingHigh" value="ratingHigh" onChange={() => sortHotels("ratingHigh")}
                    checked={sort_Value === "ratingHigh"}/>
                  </div>
                  <div className="flex justify-between items-center ">
                    <label htmlFor="ratingLow">{`Rating (Low ~ High)`}</label>
                    <input type="radio" name="sort" id="ratingLow" value="ratingLow" onChange={() => sortHotels("ratingLow")}
                    checked={sort_Value === "ratingLow"}/>
                  </div>
              </form>
              
          }
        </div>
        {/** Sort排序 - 絕對定位<form> - PC */}
        {/** Sort排序 - PC */}
        
        {/** 總共OO間飯店 - PC */}
        <p className="hidden lg:block lg:border-b lg:border-softGray lg:py-2">{redux_Hotel_List.length} Hotels</p>
        {/** 總共OO間飯店 - PC*/}
        
        {redux_Hotel_List.map((item) => {
        return <div key={item.hotel_Id} className="space-y-4">
          <article className="bg-white rounded-lg overflow-hidden shadow-sm lg:rounded-none lg:border-b lg:border-softGray
          lg:flex lg:gap-4 lg:relative">
        
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
                    <img src={img.url} alt={img.description} 
                    className="w-full h-[200px] object-cover rounded" />
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
                  <p className="text-sm text-gray-500 mt-1">{item.distance}</p>
                </div>
        
                <div className="flex flex-col gap-2 justify-center items-center lg:items-end">
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
                  <p className="hidden lg:block lg:text-sm lg:text-[#6D6D6D]">{redux_Adult + redux_Child} Guests, {how_Many_Nights(redux_Date_Start as string, redux_Date_End as string)} Nights</p>
                  {/** 人數、幾間房 - PC */}
        
                  {/** 我的收藏 - 愛心 */}
                  {item.isCollected === false ? <>
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
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hidden lg:grid lg:grid-cols-5 lg:mt-0">
                {item.facility_List?.map((facility, index) => {
                  return <div className="lg:flex lg:gap-1" key={index}>
                      {index <6 && <>
                        <FacilitySVG name={facility} className="hidden lg:block lg:w-4 lg:h-auto"></FacilitySVG>
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