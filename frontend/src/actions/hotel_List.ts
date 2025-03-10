'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import hotel_List_Json from "@/fakeData/hotel_List.json";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";

// 1. <form>搜尋 Search, 傳遞目的地/入住日 退住日/房間數、大人小孩人數
export async function Submit_Search(searchParams: { [key: string]: string }) {
  // const destination = formData.get("destination") as string;
  // const dateRange = formData.get("datepicker") as string;
  // const room = formData.get("room");
  // const adult = formData.get("adult");
  // const child = formData.get("child");
  // const rangeslider = formData.getAll("rangeSlider");
  // const rating = formData.getAll("rating");
  // const bedType = formData.getAll("bedType") as string [];
  // const facility = formData.getAll("facility") as string [];
  // console.log(destination);
  // console.log(dateRange);
  // console.log(room, adult, child);
  // console.log(rating, "星級");
  // console.log("床型", bedType);
  // console.log("設施", facility);
  // console.log("最小最大房錢", rangeslider);

  const { destination, date_Start, date_End, dateRange } = searchParams;

  // 4. 飯店名、飯店城市、飯店國家，一同匹配
  const new_Hotel_List = hotel_List_Json.filter((hotel: add_Hotel_Detail_Interface) => {
    return (
      hotel.hotel_Name?.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.country?.toLowerCase().includes(destination.toLowerCase())
    )
  });

  return new_Hotel_List;
  
  

  // 2. URL參數, 轉字串
  // const timestamp = +new Date();
  // const query = new URLSearchParams({
  //   destination,
  //   dateRange,
  //   room: String(room),
  //   adult: String(adult),
  //   child: String(child),
  //   rangeslider: String(rangeslider),
  //   timestamp: String(timestamp),
  //   bedtype: String(bedType),
  //   rating: String(rating),
  //   facility: String(facility),
  // }).toString()


  // 1.1 跳轉「飯店列表」
  // redirect(`/hotellist?${query}`);
  // revalidatePath("/hotellist");
}