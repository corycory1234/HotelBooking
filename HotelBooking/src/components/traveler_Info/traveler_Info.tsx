// 這 client 是為了 <Previous_Page>子元件有用 useRouter, 父願見一定要用 'use client'
'use client'; 
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Swiper_Hotel_Detail from "@/components/swiper_Hotel_Detail/swiper_Hotel_Detail";
import Previous_Page from "./previous_Page";
import Room_Info from "./room_Info";
import Server_Form_Traveler_Info from "@/components/traveler_Info/server_Form_Traveler_Info";


export default function Traveler_Info () {

  // 5. Redux - 被預訂飯店之之數據
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  console.log(redux_Booked_Room, "Redux - 被預訂之房型");

  
  return <>
  
  {/* 返回上頁按鈕 */}
  <Previous_Page></Previous_Page>
  {/* 返回上頁按鈕 */}

    {/** 外層背景 */}
    <div className="flex flex-col gap-3 my-bg-gradient">
      
      {/** Swiper 飯店圖片 */}
      <Swiper_Hotel_Detail redux_Booked_Room={redux_Booked_Room}></Swiper_Hotel_Detail>
      {/** Swiper 飯店圖片 */}
      

      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}
      <Room_Info></Room_Info>
      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}


      {/** 付款<Form>表單 */}
      <Server_Form_Traveler_Info></Server_Form_Traveler_Info>
      {/** 付款<Form>表單 */}

  </div>
  {/** 外層背景 */}
  </>
}