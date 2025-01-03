'use client';
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import hotel_List from "@/fakeData/hotel_List.json";
import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
import Hotel_Card from "@/components/hotel_Card/hotel_Card";

export default function Hotel_Detail () {
  // 1. 返回上一頁
  const router = useRouter();
  // 2. 抓 URL - ID
  const params = useParams();
  console.log(params);

  // 3. find找第一筆 匹配 ID 的飯店
  const the_Hotel: Hotel_Detail_Interface | undefined = hotel_List.find((item: Hotel_Detail_Interface ) => {
    return params.id === item.id 
  });
  console.log(the_Hotel, "指定飯店Detail");
  
  

  return <>
  <div className="bg-primary relative">
    <p className="text-white text-center p-4">{the_Hotel?.name}</p>
      <div className="absolute top-4 left-4 z-10 h-[56px]">
          <button type="button" className="" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
      </div>
    </div>

    {/** 飯店卡片 */}
    <Hotel_Card the_Hotel={the_Hotel}></Hotel_Card>
    {/** 飯店卡片 */}
  </>
}