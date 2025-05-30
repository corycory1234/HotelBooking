'use client';
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
// import { Submit_Search } from "@/actions/hotel_List";
// import Client_RangeSlider from "../form_Search/client_RangeSlider";
// import Client_BedType from "../form_Search/client_BedType";
// import Client_Rating from "../form_Search/client_Rating";
// import Client_Faciliy from "../form_Search/client_Facility";
import { updateRangeSlider, updateBedType, updateRating, updateFacility } from "@/store/form-Search/formSearchSlice";
import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@nextui-org/slider";
import { useTranslations } from "next-intl";

// 0. 所有設施 Arr
const facility_Arr = ["wifi", "parking", "24hrcheckin", "bathtub", "gym", "pool", "balcony", "kitchen",]

export default function AdvancedSearchPc () {
  // 0. 取 Redux - Action「搜尋相關函式」
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();

  // 1.  取 Redux「搜尋相關數據」
  const destination = useSelector((state: RootState) => state.formSearch.keyword);
  const redux_DateRange = useSelector((state: RootState) => state.formSearch.dateRange);
  const redux_Date_Start = useSelector((state: RootState) => state.formSearch.start_Date);
  const redux_Date_End = useSelector((state: RootState) => state.formSearch.end_Date);
  const redux_Room = useSelector((state: RootState) => state.formSearch.room);
  const redux_Adult = useSelector((state: RootState) => state.formSearch.adult);
  const redux_Child = useSelector((state: RootState) => state.formSearch.child);
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType) || [];
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating) || [];
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility) || [];

 // 6. 送出<form>按鈕
  const handleSubmit = () => {
  if (formRef.current) {
    formRef.current.requestSubmit(); // 觸發表單的 onSubmit 事件
  }
};

    // 7. 取 <form>表單之 ref
    const formRef = useRef<HTMLFormElement>(null);

    // 8. 進階搜尋 - 飯店列表 API
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      //     page: Number(params.get("page"))
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
        page: String(params.get("page"))
      }).toString();
      router.push(`/hotellist?${search_Params}`)

      // const formValue = Object.fromEntries(formData.entries());
      // console.log(range_Slider, bed_Type, rating, facility,"看看FormData的值˙阿");
      // handleSubmit();      // 更新 Redux 狀態
    
      // if (formRef.current) {
      //   const formData = new FormData(formRef.current);
      //   Submit_Search(formData);
      // }
    };

  // 9. 初始化所有篩選條件 
  const reset = () => {
    dispatch(updateRangeSlider([100,9900]));
    dispatch(updateBedType([]));
    dispatch(updateRating([]));
    dispatch(updateFacility([]));
  }

  // 3. 最小價錢 與 最大價錢陣列 - Range Slider
  const handle_RangeSlider = (newValue: number | number[]) => {
    dispatch(updateRangeSlider(newValue))
  };

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
  };

  // 5. next-intle i18n 翻譯
  const t = useTranslations("AdvancedSearch");



  return <>
      <form ref={formRef} onSubmit={handleFormSubmit} className="mx-auto flex flex-col h-[580px] overflow-auto">
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}
          <input type="hidden" name="destination" value={destination} />
          <input type="hidden" name="datepicker" value={redux_DateRange || ""} />
          <input type="hidden" name="room" value={redux_Room} />
          <input type="hidden" name="adult" value={redux_Adult} />
          <input type="hidden" name="child" value={redux_Child} />
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}

        <div className="flex justify-between items-center p-4 border-b border-softGray">
          <h2 className="text-lg font-semibold">{t ("Advanced Search")}</h2>
        </div>

        <div className="flex flex-col overflow-y-auto px-4 py-2 gap-6">
          
        {/********** 最小最大旅館價格 - RangeSlider **********/}
          <div className="pt-4">        
            <h3 className="font-semibold">{t ("Price Range")}</h3>
            <div className="flex flex-col gap-2 w-full h-full items-start justify-center">
              <Slider
                name="rangeslider"
                className="text-sm"
                formatOptions={{style: "currency", currency: "USD"}}
                label=" "
                maxValue={9900}
                minValue={100}
                step={100}
                value={redux_RangeSlider}
                onChange={handle_RangeSlider}
              />
            </div>
          </div>
          <div className="border-b border-softGray"></div>
        {/********** 最小最大旅館價格 - RangeSlider **********/}

        {/**********  床型 **********/}
          <div className="border-b border-softGray pb-4">
            <h3 className="font-medium mb-3">{t ("Bed Type")}</h3>
            {/* <Client_BedType></Client_BedType> */}
            <div className="space-y-2">          
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="singlebed" name="bedtype"
                checked={redux_BedType.includes("singlebed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>
                <span>{t ("Single Bed")}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="twinbed" name="bedtype"
                checked={redux_BedType.includes("twinbed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>{t ("Twin Bed")}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="doublebed" name="bedtype"
                checked={redux_BedType.includes("doublebed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>{t ("Double Bed")}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="queenbed" name="bedtype"
                checked={redux_BedType.includes("queenbed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>{t ("Queen Bed")}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="kingbed" name="bedtype"
                checked={redux_BedType.includes("kingbed")}
                onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
                <span>{t ("King Bed")}</span>
              </label>
            </div>
          </div>
        {/**********  床型 **********/}

        {/********** 飯店星級 **********/}
          <div className="border-b border-softGray pb-4">
            <h3 className="font-medium mb-3">{t ("Rating")}</h3>
            {/* <Client_Rating></Client_Rating> */}
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


        {/********** 設施 **********/}
          <div className="">
          <h3 className="font-medium mb-3">{t ("Facility")}</h3>
          {/* <Client_Faciliy></Client_Faciliy> */}
            <div className="space-y-2">
              {facility_Arr.map((item, index) => {
                return <div key={index}>
                { 
                  /* 顯示4個 Facility 或 全部顯示 */
                  <label className={`flex items-center gap-2 ${toggle_Boo === true ? '' : index >=4 ? 'hidden' : '' }`} key={index}>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray" name="facility" value={item}
                    onChange={(event) => handel_Facility(event.target.value, event.target.checked)}
                    checked={redux_Facility.includes(item)}/>            
                    <span>{t (item.charAt(0).toUpperCase() + item.slice(1))}</span>
                  </label>
                }
                </div>
              })}
              <span onClick={toggle_Facility} className="text-primary cursor-pointer">{toggle_Boo ? t("Hide") : t("Show All") }</span>
            </div>
          </div>
        {/********** 設施 **********/}

        </div>

        {/** 重置 & 確定 按鈕 */}
        <div className="flex border-t border-softGray p-4 gap-4 justify-between items-center">      
          <button className="basis-1/2 py-2 border border-gray rounded" type="button" onClick={reset}>{t ("Reset")}</button>
          <button className="basis-1/2 py-2 rounded bg-primary text-white">{t ("Apply")}</button>
        </div>
        {/** 重置 & 確定 按鈕 */}
      </form>

  </>
}