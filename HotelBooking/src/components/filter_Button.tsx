'use client';
import Modal from "./modal/modal";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
// import { Submit_Search } from "@/actions/hotel_List";
import { useRouter, useSearchParams } from "next/navigation";
// import Client_RangeSlider from "./form_Search/client_RangeSlider";
// import Client_BedType from "./form_Search/client_BedType";
// import Client_Rating from "./form_Search/client_Rating";
// import Client_Faciliy from "./form_Search/client_Facility";
import { updateRangeSlider, updateBedType, updateRating, updateFacility } from "@/store/form-Search/formSearchSlice";
import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";
import { Slider } from "@nextui-org/slider";

// 0. 所有設施 Arr
const facility_Arr = ["pool", "balcony", "24H Check-In", "gym", "parking", "bathtub", "kitchen", "wifi",]

export default function Filter_Button () {

  // 0. 取 Redux - Action「搜尋相關函式」
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // 1.  取 Redux「搜尋相關數據」
  const destination = useSelector((state: RootState) => state.formSearch.keyword);
  const redux_DateRange = useSelector((state: RootState) => state.formSearch.dateRange);
  const redux_Date_Start = useSelector((state: RootState) => state.formSearch.start_Date);
  const redux_Date_End = useSelector((state: RootState) => state.formSearch.end_Date);
  const redux_Room = useSelector((state: RootState) => state.formSearch.room);
  const redux_Adult = useSelector((state: RootState) => state.formSearch.adult);
  const redux_Child = useSelector((state: RootState) => state.formSearch.child);
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating) || [];
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility) || [];

  // 2. 需要 timeStamp 時間戳, 來偵測「Apply」當下幾毫秒, 若有變, 
  // 2. 就關掉Modal(關掉前會送出 Server Action - Submit_Search函式) 
  const searchParams = useSearchParams();
  const timestamp = searchParams.get("timestamp");
  
  // 3. Filter 彈跳Modal, 布林開關
  const [filter_Boolean, setFilter_Boolean] = useState<boolean>(false);
  const show_Filter_Modal = () => {
    setFilter_Boolean(!filter_Boolean)
  }

  // 4. 若 timeStamp時間戳有異動，布林轉false，關掉談 Filter 彈跳Modal
  useEffect(() => {
    setFilter_Boolean(false);
  },[timestamp])

  // 5. 初始化所有篩選條件 
  const reset = () => {
    dispatch(updateRangeSlider([0,9999]));
    dispatch(updateBedType([]));
    dispatch(updateRating([]));
    dispatch(updateFacility([]));
  }

  // 8. 進階搜尋 - 飯店列表 API
  const advanced_Search = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止默認的表單提交行為
    const formData = new FormData(event.currentTarget);
    const range_Slider = formData.getAll("rangeslider");
    const bed_Type = formData.getAll("bedtype");
    const rating = formData.getAll("rating");
    const facility = formData.getAll("facility");
      
    // const response = await fetch("/api/hotel_List", {
    //   method: "POST",
    //   headers: {"Content-Type": "application/json"},
    //   body: JSON.stringify({
    //     destination: destination,
    //     dateRange: redux_DateRange,
    //     date_Start: redux_Date_Start,
    //     date_End: redux_Date_End,
    //     room: redux_Room,
    //     adult: redux_Adult,
    //     child: redux_Child,
    //     rangeslider: range_Slider,
    //     rating: rating,
    //     bedType: bed_Type,
    //     facility: facility,
    //     page: Number(searchParams.get("page"))
    //   })
    // });
    // if(!response.ok){throw new Error(`Server error: ${response.status}`)};
    // const result = await response.json();
    // dispatch(update_Hotel_List(result.data));

    // 8.1 路由必須更新, 尤其是timestamp, 其變動, 才會有Skeleton動畫
    const timestamp = + new Date();
    const search_Params = new URLSearchParams({
      destination: destination as string,
      dateRange: redux_DateRange as string,
      date_Start: redux_Date_Start as string,
      date_End: redux_Date_End as string,
      room: String(redux_Room),
      adult: String(redux_Adult),
      child: String(redux_Child),
      rangeslider: String(range_Slider),
      timestamp: String(timestamp),
      bedtype: String(bed_Type),
      rating: String(rating),
      facility: String(facility),
      page: String(searchParams.get("page"))
    }).toString();
    router.push(`/hotellist?${search_Params}`)
  };

  // 3. 最小價錢 與 最大價錢陣列 - Range Slider
  const handle_RangeSlider = (newValue: number | number[]) => {
    dispatch(updateRangeSlider(newValue))
  };

  // 2. Redudx 取 rangeSlider 初始值
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType) || [];

  // 3. Redux 床型 Checkbox 打勾/取消 函式
  const handel_BedType = (bed: string, isChecked: boolean) => {
    if(isChecked){
      dispatch(updateBedType([...redux_BedType, bed]));
    } else {
      dispatch(updateBedType(redux_BedType.filter((item) => item !== bed)));
    }
  };

  // 3. Redux 飯店星級 Checkbox 打勾/取消 函式
  const handel_Rating = (rating: number, isChecked: boolean) => {
    if (isChecked) {
      dispatch(updateRating([...redux_Rating, rating]));
    } else {
      dispatch(updateRating(redux_Rating.filter((item) => item !== rating)));
    }
  };

  // 3. Redux 設施 Checkbox 打勾/取消 函式
  const handel_Facility = (facility: string, isChecked: boolean) => {
    if(isChecked) {
      dispatch(updateFacility([...redux_Facility, facility]));
    } else {
      dispatch(updateFacility(redux_Facility.filter((item) => item !== facility)));
    }
  }

  // 4. 開|關 所有設施 checkbox
  const [toggle_Boo, set_Toggle_Boo] = useState(false);
  const toggle_Facility = () => {
    set_Toggle_Boo(!toggle_Boo);
  }


  return <>
    {/* Filter 與 熱門搜尋條件 */}
    <div className="px-4 py-2 flex items-center gap-3 overflow-x-auto scrollbar-hidden">
      <button  onClick={show_Filter_Modal} className="flex items-center py-1 px-2 bg-custom rounded text-sm bg-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">5 Star</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">Pool</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">Spa</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">Beach</button>
    </div>
    {/* Filter 與 熱門搜尋條件 */}


    {/** Filter 彈跳視窗 */}
    {<Modal isOpen={filter_Boolean} onClose={() => setFilter_Boolean(false)}>
      <title>Filter Modal</title>


      <form onSubmit={advanced_Search} className="mx-auto flex flex-col">
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}
          {/* <input type="hidden" name="destination" value={destination} />
          <input type="hidden" name="datepicker" value={storedDateRange || ""} />
          <input type="hidden" name="room" value={room} />
          <input type="hidden" name="adult" value={adult} />
          <input type="hidden" name="child" value={child} /> */}
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}

        <div className="flex justify-between items-center p-4 border-b border-gray">
          <h2 className="text-lg font-semibold">Filter</h2>
        </div>

        <div className="flex flex-col overflow-y-auto px-4 py-2 gap-6">
          
        {/********** 最小最大旅館價格 - RangeSlider **********/}
          <div className="border-b border-gray pb-4">        
            <h3 className="font-semibold">Price Range</h3>
              <div className="flex flex-col gap-2 w-full h-full items-start justify-center">
                <Slider
                  name="rangeslider"
                  className="text-sm"
                  formatOptions={{style: "currency", currency: "USD"}}
                  label=" "
                  maxValue={9900}
                  minValue={0}
                  step={100}
                  value={redux_RangeSlider}
                  onChange={handle_RangeSlider}
                />
              </div>
          </div>
        {/********** 最小最大旅館價格 - RangeSlider **********/}

        {/**********  床型 **********/}
          <div className="border-b border-gray pb-4">
            <h3 className="font-semibold mb-3">Bed Type</h3>
            <div className="space-y-2">          
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="singlebed" name="bedtype"
                checked={redux_BedType.includes("singlebed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>
                <span>Single Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="twinbed" name="bedtype"
                checked={redux_BedType.includes("twinbed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>Twin Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="doublebed" name="bedtype"
                checked={redux_BedType.includes("doublebed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>Double Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="queenbed" name="bedtype"
                checked={redux_BedType.includes("queenbed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>Queen Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="kingbed" name="bedtype"
                checked={redux_BedType.includes("kingbed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>King Bed</span>
              </label>
            </div>
          </div>
         {/**********  床型 **********/}

        {/********** 飯店星級 **********/}
          <div className="border-b border-gray pb-4">
            <h3 className="font-semibold mb-3">Rating</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="rating" className="w-4 h-4" value={5}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={redux_Rating.includes(5)} />
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                </div>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="rating" className="w-4 h-4" value={4}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={redux_Rating.includes(4)} />
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
              </label>


              <label className="flex items-center gap-2">
                <input type="checkbox" name="rating" className="w-4 h-4" value={3}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={redux_Rating.includes(3)} />
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="rating" className="w-4 h-4" value={2}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={redux_Rating.includes(2)} />
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="rating" className="w-4 h-4" value={1}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={redux_Rating.includes(1)} />
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
              </label>
            </div>
          </div>
        {/********** 飯店星級 **********/}


          {/** 設施 */}
          <div className="">
            <h3 className="font-semibold mb-3">Facility</h3>
            <div className="space-y-2">
              {facility_Arr.map((item, index) => {
                return <div key={index}>
                { 
                  /* 顯示4個 Facility 或 全部顯示 */
                  <label className={`flex items-center gap-2 ${toggle_Boo === true ? '' : index >=4 ? 'hidden' : '' }`} key={index}>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray" name="facility" value={item}
                    onChange={(event) => handel_Facility(event.target.value, event.target.checked)}
                    checked={redux_Facility.includes(item)}/>            
                    <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  </label>
                }
                </div>
              })}
              <span onClick={toggle_Facility} className="text-primary cursor-pointer">{toggle_Boo ? "Hide" : "Show All"}</span>
            </div>
          </div>
          {/** 設施 */}

        </div>

        {/** 重置 & 確定 按鈕 */}
        <div className="flex border-t border-gray p-4 gap-4 justify-between items-center">      
          <button className="basis-1/2 py-2 border border-gray rounded" type="button" onClick={reset}>Reset</button>
          <button className="basis-1/2 py-2 rounded bg-primary">Apply</button>
        </div>
        {/** 重置 & 確定 按鈕 */}
      </form>


    </Modal>}
    {/** Filter 彈跳視窗 */}
  </>
}