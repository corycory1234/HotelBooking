'use client';
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import hotel_List from "@/fakeData/hotel_List.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import Modal from "@/components/modal/modal";
import Server_Form_Search from "@/components/server-Form-Search/server-Form-Search";
import Hotel_Card from "@/components/hotel_Card/hotel_Card";
import { update_Hotel_Detail } from "@/store/hotel_Detail/hotel_Detail";

export default function Hotel_Detail () {
  // 1. 返回上一頁
  const router = useRouter();

  // 2. 抓 URL - ID
  const params = useParams();

  // 3. dispatch 拿取 Redux 之 Action函式
  const dispatch = useDispatch();

  // 4. 撈 JSON 當中的指定飯店
  const the_Found_Hotel = hotel_List.find((item) => params.id === item.id);

  // 5.  生命週期：組件載入後，dispatch 更新 Redux
  // 5.1 也可寫在 useEffect 中，只在 id 變動時重新 dispatch
  useEffect(() => {
    if(the_Found_Hotel) {
      dispatch(update_Hotel_Detail(the_Found_Hotel));
    }
  },[params.id]);

  // 6. Redux - 指定飯店明細
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);
  console.log("Redux 指定飯店", redux_Hotel_Detail);
  

  // 7. Redux - 入住退房日; replace搭配正則，把"202X -"拿掉
  const redux_DateRange = useSelector((state: RootState) => state.formSearch.dateRange)?.replace(/\d{4}-/g, "");
  
  // 8. <form>搜尋 Modale 開關
  const [toggle, set_Toggle] = useState<boolean>(false);
  const show_FormSearch = () => set_Toggle(true);

  return <>
  
  {/* 返回上頁按鈕、Modla 彈跳<form>搜尋視窗 */}
  <div className="bg-primary relative">
    <div className="flex flex-col py-2 cursor-pointer" onClick={show_FormSearch}>
      <p className="text-center">{redux_Hotel_Detail?.name}</p>
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
    <Hotel_Card the_Hotel={redux_Hotel_Detail}></Hotel_Card>
    {/** 飯店卡片 */}
  </>
}