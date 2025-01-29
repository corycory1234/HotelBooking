'use client';
import Client_Input_Keyword from "./client-Input-Keyword";
import DateRangePicker from "./dateRangePicker";
import Client_Input_Traveler from "./client-Input-Traveler";
// import { Submit_Search } from "../../actions";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Toaster_Notify from "../toaster/toaster";
import toast from "react-hot-toast";

export default function Server_Form_Search () {
  // 0. 路由
  const router = useRouter();

  // 1. Redux - 入住日、退房日
  const redux_Start_Date = useSelector((state: RootState) => state.formSearch.start_Date);
  const redux_End_Date = useSelector((state: RootState) => state.formSearch.end_Date);

  // 1. 尚未接 後端API
  const submit_Search = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
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
        date_End: redux_Start_Date as string,
        room: String(room),
        adult: String(adult),
        child: String(child),
        rangeslider: String(rangeslider),
        timestamp: String(timestamp),
        bedtype: String(bedType),
        rating: String(rating),
        facility: String(facility),
      }).toString()
    
    
    // 4 跳轉「飯店列表」
    router.push(`/hotellist?${query}`);
  }


  return <>
  <Toaster_Notify></Toaster_Notify>

    <form onSubmit={submit_Search} className="flex flex-col lg:flex-row lg:flex-wrap p-4 gap-4 
    lg:shadow-lg lg:rounded-lg
    items-center">
      <Client_Input_Keyword></Client_Input_Keyword>
      <DateRangePicker></DateRangePicker>
      <Client_Input_Traveler></Client_Input_Traveler>
      <button className="bg-primary rounded w-full py-2 px-4 lg:w-1/2 lg:mx-auto">
        Search
      </button>
    </form>
  </>
}