'use client';
import { useDispatch, useSelector } from "react-redux";
import { updateKeyword } from "../../store/form-Search/formSearchSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useEffect, useState, useRef } from "react";
import hotel_List_Json from "@/fakeData/hotel_List.json";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { Debounced_Hotel_List_Interface } from "@/types/debounced_Hotel_List";
import { update_Hotel_List, } from "@/store/hotel_List/hotel_List_Slice";
import { OtherSVG } from "../client_Svg/client_Svg";
import { useTranslations } from "next-intl";
import useClikOutside from "../useClickOutside";

interface Debounced_Hotel_Interface {
  hotel_Id: string,
  hotel_Name: string | null,
  city: string | null,
  country: string | null,
}
interface Debounced_City_Interface {
  city: string | null,
  country: string | null
}

export default function Client_Input_Keyword () {
  // 1. 提取 Redux - formSeach表單 keyword
  const dispatch: AppDispatch = useDispatch();
  const redux_keyword = useSelector((state: RootState) => state.formSearch!.keyword)
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);
  const redux_Rating = useSelector((state: RootState) => state.formSearch.rating);
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility);
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType);



  // 2. Redux - 飯店列表陣列
  const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List2.hotel_List);

  // 3. 防抖搜尋 - 本地陣列狀態
  const timer_Ref = useRef<NodeJS.Timeout | null>(null);
  const [destination, set_Destination] = useState<string>("");
  const [debounced_City, set_Debounced_City] = useState<Debounced_City_Interface[]>([]);
  const [debounced_Hotel, set_Debounced_Hotel] = useState<Debounced_Hotel_List_Interface[]>([]);
  
  // 4. 防抖搜尋 -函式
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
        // console.log(result, "飯店列表API - 返回數據");

        // const new_Hotel_List = result.data.data.filter((hotel: add_Hotel_Detail_Interface) => {
        //   // 3.1 飯店名、飯店城市、飯店國家，一同匹配
        //   return (
        //     hotel.hotel_Name?.toLowerCase().includes(event.target.value.toLowerCase()) ||
        //     hotel.city?.toLowerCase().includes(event.target.value.toLowerCase()) ||
        //     hotel.country?.toLowerCase().includes(event.target.value.toLowerCase())
        //   )
        // });
        set_Debounced_Hotel(result.data.data);
        set_Debounced_Boolean(true)

        // dispatch(update_Hotel_List(new_Hotel_List));

        // if(!keyword.trim()){
        //   set_Debounced_Hotel([]);
        //   set_Debounced_City([]);
        //   return;
        // }

        // 匹配 飯店名、飯店所在城市、飯店所在國家
        // const match_Hotel: Debounced_Hotel_Interface[] = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
        //   return hotel.hotel_Name?.toLowerCase().includes(keyword.toLowerCase()) ||
        //   hotel.city?.toLowerCase().includes(keyword.toLowerCase()) ||
        //   hotel.country?.toLowerCase().includes(keyword.toLowerCase())
        // }).map((item) => {
        //   return { hotel_Id: item.hotel_Id, hotel_Name: item.hotel_Name, city: item.city, country: item.country}
        // });
        // set_Debounced_Hotel(match_Hotel);

        // 匹配 飯店所在城市、飯店所在國家
        // const match_City: Debounced_City_Interface[] = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
        //   return hotel.city?.toLowerCase().includes(keyword.toLowerCase()) || hotel.country?.toLowerCase().includes(keyword.toLowerCase());
        // })
        // .map((item: add_Hotel_Detail_Interface) => {
        //   return { city: item.city, country: item.country }
        // });
        // const temporary_Set = new Set<string>();
        // const no_Repeated_CityCountry: Debounced_City_Interface[] = [];
        // match_City.forEach((item) => {
        //   const key = `${item.city} - ${item.country}`;
        //   if(!temporary_Set.has(key)) {
        //     temporary_Set.add(key);
        //     no_Repeated_CityCountry.unshift(item)
        //   }
        // });
        // set_Debounced_City(no_Repeated_CityCountry)

      } catch (error) {
        console.log(error);
      }
    },500)
  }

  // 5. 防抖搜尋 - 布林開關
  const [debounced_Boolean, set_Debounced_Boolean] = useState<boolean>(true);
  const hidden_Debounced_Hotel_List = (keyword: string) => {
    dispatch(updateKeyword(keyword));
    set_Debounced_Boolean(false);
  };

  // useEffect(() => {
  //   console.log(debounced_City, "debounced_City 飯店陣列");
  // }, [debounced_City])

  // 6. next-intl i18n 翻譯
  const t = useTranslations("FormSearch");

  // 7. 防抖搜尋 - 布林開關 & 冒泡事件(點外層關掉) 
  const debounced_Ref = useRef<HTMLDivElement>(null);
  useClikOutside(debounced_Ref, () => set_Debounced_Boolean(false))
  
  
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
        debounce_Search(event)
      }
    }
    value={redux_keyword}
    // onChange={(event) => set_Destination(event.target.value)}
    // value={destination}
    name="destination"/>

  <div className="flex flex-col" ref={debounced_Ref}>
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

    {/* {debounced_City.length >0 && debounced_City.map((city, index) => {
      return <div key={index} className="flex flex-col">
        <div className="flex">
          <OtherSVG name="calendar" className="w-4 h-auto"></OtherSVG>
          <p>{city.city}, {city.country}</p>
        </div>
      </div>
    })} */}

  </div>

  </>
}