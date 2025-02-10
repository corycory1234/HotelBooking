'use client';
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Submit_Search } from "@/actions/hotel_List";
import Client_RangeSlider from "../form_Search/client_RangeSlider";
import Client_BedType from "../form_Search/client_BedType";
import Client_Rating from "../form_Search/client_Rating";
import Client_Faciliy from "../form_Search/client_Facility";
import { updateRangeSlider, updateBedType, updateRating, updateFacility } from "@/store/form-Search/formSearchSlice";
import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";
import { useRouter } from "next/navigation";

export default function Advanced_Search_Pc () {
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
  // const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  // const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);
  // const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
  // const redux_Facility = useSelector((state: RootState) => state.formSearch.facility);


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
      
      const response = await fetch("/api/hotel_List", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          destination: destination,
          dateRange: redux_DateRange,
          date_Start: redux_Date_Start,
          date_End: redux_Date_End,
          room: redux_Room,
          adult: redux_Adult,
          child: redux_Child,
          rangeslider: range_Slider,
          rating: rating,
          bedType: bed_Type,
          facility: facility
        })
      });
      if(!response.ok){throw new Error(`Server error: ${response.status}`)};
      const result = await response.json();
      dispatch(update_Hotel_List(result.data));

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

  // 5. 初始化所有篩選條件 
  const reset = () => {
    dispatch(updateRangeSlider([0,9999]));
    dispatch(updateBedType([]));
    dispatch(updateRating([]));
    dispatch(updateFacility([]));
  }



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
          <h2 className="text-lg font-semibold">Advanced Search</h2>
        </div>

        <div className="flex flex-col overflow-y-auto px-4 py-2 gap-6">
          
          {/** 最小最大旅館價格 - RangeSlider */}
          <div className="pb-4">        
            <h3 className="font-medium mb-3">Price Range</h3>
              <Client_RangeSlider></Client_RangeSlider>
          </div>
          <div className="border-b border-softGray"></div>
          {/** 最小最大旅館價格 - RangeSlider */}

          {/* 床型 */}
          <div className="border-b border-softGray pb-4">
            <h3 className="font-medium mb-3">Bed Type</h3>
            <Client_BedType></Client_BedType>
          </div>
          {/* 床型 */}

          {/** 飯店星級 */}
          <div className="border-b border-softGray pb-4">
            <h3 className="font-medium mb-3">Rating</h3>
            <Client_Rating></Client_Rating>
          </div>
          {/** 飯店星級 */}


          {/** 設施 */}
          <div className="">
          <h3 className="font-medium mb-3">Facility</h3>
          <Client_Faciliy></Client_Faciliy>
          </div>
          {/** 設施 */}

        </div>

        {/** 重置 & 確定 按鈕 */}
        <div className="flex border-t border-softGray p-4 gap-4 justify-between items-center">      
          <button className="basis-1/2 py-2 border border-gray rounded" type="button" onClick={reset}>Reset</button>
          <button className="basis-1/2 py-2 rounded bg-primary text-white">Apply</button>
        </div>
        {/** 重置 & 確定 按鈕 */}
      </form>

  </>
}