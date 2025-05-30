'use client';
import { useDispatch, useSelector } from "react-redux";
import { updateKeyword } from "../../store/form-Search/formSearchSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useState, useRef } from "react";
import { DebouncedHotel } from "@/types/debouncedHotel";
import { OtherSVG } from "../client_Svg/client_Svg";
import { useTranslations } from "next-intl";
import useClickOutside from "@/hooks/useClickOutside";
import { fetchDebouncedHotels } from "@/services/api/debouncedHotelService";

export default function Keyword () {
  // 1. 提取 Redux - formSeach表單 keyword
  const dispatch: AppDispatch = useDispatch();
  const redux_keyword = useSelector((state: RootState) => state.formSearch!.keyword)
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility);
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);

  // 2. 防抖搜尋 - 本地陣列狀態
  const [debouncedHotelList, setDebouncedHotelList] = useState<DebouncedHotel[]>([]);
  
  // 3. Debounce - 計時器ID
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // 4. 防抖搜尋 - API請求
  const debounceSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // 4.1 有計時器ID(Debounce 成功返回 搜尋飯店API), 若User又多打關鍵字, 就清除掉 計時器ID
    if(timerId.current) clearTimeout(timerId.current);

    timerId.current = setTimeout(async () => {
      const keyword = event.target.value.trim();
      if(!keyword) {
        setDebouncedHotelList([]); 
        return;
      };

      try {
        const result = await fetchDebouncedHotels({
          page: 1,
          q: keyword,
          city: "",
          country: "",
          minPrice: Array.isArray(redux_RangeSlider) ? redux_RangeSlider[0] : redux_RangeSlider,
          maxPrice: Array.isArray(redux_RangeSlider) ? redux_RangeSlider[1] : redux_RangeSlider,
          ratings: String(redux_Rating),
          facilities: redux_Facility || [],
          bedTypes: String(redux_BedType),
        })
        setDebouncedHotelList(result);
        setDebouncedBoolean(true);
      } 
      catch (error) {
        console.log(error);
      }
    },300)
  }

  // 5. 防抖搜尋 - map渲染 布林開關
  const [debouncedBoolean, setDebouncedBoolean] = useState<boolean>(true);

  // 6. 點擊 debounce 出來的指定飯店, Redux_keyword就更新, 並關掉 map渲染
  const hidden_Debounced_Hotel_List = (keyword: string) => {
    dispatch(updateKeyword(keyword));
    setDebouncedBoolean(false);
  };

  // 7. next-intl i18n 翻譯
  const t = useTranslations("FormSearch");

  // 8. 防抖搜尋 - 布林開關 & 冒泡事件(點外層關掉) 
  const debouncedRef = useRef<HTMLDivElement>(null);
  useClickOutside(debouncedRef, () => setDebouncedBoolean(false))
  
  
  return <>
  <div className="relative w-full ">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-2 right-2 text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>

    <input type="text" placeholder={t ("Where are you going?")} 
      className="w-full py-2 px-4 rounded outline-none lg:border lg:border-gray bg-white"
      onChange={(event) => {
        dispatch(updateKeyword(event.target.value)),
        debounceSearch(event)
      }}
      value={redux_keyword}
      name="destination"
    />

  <div className="flex flex-col" ref={debouncedRef}>
    {(debouncedHotelList.length >0 && debouncedBoolean === true) ? debouncedHotelList.map((hotel, index) => {
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
  </div>

  </>
}