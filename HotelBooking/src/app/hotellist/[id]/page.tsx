'use client';
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import hotel_List from "@/fakeData/hotel_List.json";
import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import Modal from "@/components/modal/modal";
import Server_Form_Search from "@/components/server-Form-Search/server-Form-Search";
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

  // 4. Redux - 入住退房日; replace搭配正則，把"202X -"拿掉
  const redux_DateRange = useSelector((state: RootState) => state.formSearch.dateRange)?.replace(/\d{4}-/g, "");
  
  // 5. 
  const [toggle, set_Toggle] = useState<boolean>(false);
  const show_FormSearch = () => set_Toggle(true);

  return <>
  {/* 返回上頁按鈕、Modla 彈跳<form>搜尋視窗 */}
  <div className="bg-primary relative">
    <div className="flex flex-col py-4">
      <p className="text-center" onClick={show_FormSearch}>{the_Hotel?.name}</p>
      <p className="text-center">{redux_DateRange}</p>
    </div>

      <div className="absolute top-4 left-4 z-10 h-[56px]">
        <button type="button" className="" onClick={() => router.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>
    </div>
    {/* 返回上頁按鈕、Modla 彈跳<form>搜尋視窗 */}

    {/* Modal彈跳視窗 */}
      <Modal isOpen={toggle} onClose={() => set_Toggle(false)}>
        <h2 className="text-xl font-bold mb-4 p-6">Change Keyword</h2>
        <Server_Form_Search></Server_Form_Search>
      </Modal>
    {/* Modal彈跳視窗 */}


    {/** 飯店卡片 */}
    <Hotel_Card the_Hotel={the_Hotel}></Hotel_Card>
    {/** 飯店卡片 */}
  </>
}