'use client';
import hotel_List_Json from "@/fakeData/hotel_List.json"
import Client_Input_Keyword from "./client-Input-Keyword";
import DateRangePicker from "./dateRangePicker";
import Client_Input_Traveler from "./client-Input-Traveler";
// import { Submit_Search } from "../../actions";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Toaster_Notify from "../toaster/toaster";
import toast from "react-hot-toast";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";

export default function Index_Form_Search () {
  // 0. 路由
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch(); 

  // 1. Redux - 入住日、退房日
  const redux_Start_Date = useSelector((state: RootState) => state.formSearch.start_Date);
  const redux_End_Date = useSelector((state: RootState) => state.formSearch.end_Date);

  // 1. 尚未接 後端API
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
      console.log(destination);
      console.log(dateRange);
      console.log(room, adult, child);
      console.log(rating, "星級");
      console.log("床型", bedType);
      console.log("設施", facility);
      console.log("最小最大房錢", rangeslider);
  
      // 2. 吐司訊息, 防止沒輸入數據
      if(!destination || destination.trim() === ""){
        toast.error("Please Type Your Destination");
        return;
      };
      if(!dateRange || dateRange.trim() === "") {
        toast.error("Please Select DateRange");
        return;
      };
        
        
      
        // 3. URL參數, 轉字串
        const timestamp = +new Date();
        const query = new URLSearchParams({
          destination,
          dateRange,
          date_Start: redux_Start_Date as string,
          date_End: redux_End_Date as string,
          room: String(room),
          adult: String(adult),
          child: String(child),
          rangeslider: String(rangeslider),
          timestamp: String(timestamp),
          bedtype: String(bedType),
          rating: String(rating),
          facility: String(facility),
        }).toString()

        const new_Hotel_List = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
          // 3.1 飯店名、飯店城市、飯店國家，一同匹配
          return (
            hotel.hotel_Name?.toLowerCase().includes(destination.toLowerCase()) ||
            hotel.city?.toLowerCase().includes(destination.toLowerCase()) ||
            hotel.country?.toLowerCase().includes(destination.toLowerCase())
          )
        });
        dispatch(update_Hotel_List(new_Hotel_List));
      
      
      // 4 跳轉「飯店列表」
      router.push(`/hotellist?${query}`);
      
    } catch (error) {
      console.log(error);
    }
  }


  return <>
  <Toaster_Notify></Toaster_Notify>

    <form onSubmit={submit_Search} className="flex flex-col lg:flex-row lg:flex-wrap p-4 gap-4 
    lg:shadow-lg lg:rounded-lg
    items-center">
      <Client_Input_Keyword></Client_Input_Keyword>
      <DateRangePicker></DateRangePicker>
      <Client_Input_Traveler></Client_Input_Traveler>
      <button className="bg-primary text-white rounded w-full py-2 px-4 lg:w-1/2 lg:mx-auto">
        Search
      </button>
    </form>
  </>
}