'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. <form>搜尋 Search, 傳遞目的地/入住日 退住日/房間數、大人小孩人數
export async function Submit_Search(formData: FormData) {
  const destination = formData.get("destination") as string;
  const dateRange = formData.get("datepicker") as string;
  const room = formData.get("room");
  const adult = formData.get("adult");
  const child = formData.get("child");
  console.log(destination);
  console.log(dateRange);
  console.log(room, adult, child);

  // 2. URL參數, 轉字串
  const timestamp = +new Date();
  const query = new URLSearchParams({
    destination,
    dateRange,
    room: String(room),
    adult: String(adult),
    child: String(child),
    timestamp: String(timestamp)
  }).toString()


  // 1.1 跳轉「飯店列表」
  redirect(`/hotellist?${query}`);
  // revalidatePath("/hotellist");
}