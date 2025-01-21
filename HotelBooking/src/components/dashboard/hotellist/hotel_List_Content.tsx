'use client';
import { DashboardSVG } from "@/components/client_Svg/client_Svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Modal from "@/components/modal/modal";
import { useState } from "react";
import Edit_Hotel_List_Modal from "./edit_Hotel_List_Modal";
import { add_Hotel_Detail_Interface, add_Review_Type_Interface, add_Hotel_Room_Type_Interface  } from "@/types/add_Hotel_Detail";

export default function Hotel_List_Content () {
  // 1. Redux - 飯店列表
  const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List);
  console.log("Redux - 飯店列表", redux_Hotel_List);
  
  // 2. 打開 Modal 彈跳視窗
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false)
  const open_Modal = () => {
    set_Modal_Boolean(!modal_Boolean);
  }
  const close_Modal = () => {
    set_Modal_Boolean(false); // 關視窗
    set_The_Editing_Hotel(null) // 關掉後, <form><input> 全部清空
  }

  // 3. 傳ID, 撈指定飯店之數據
  const [the_Editing_Hotel, set_The_Editing_Hotel] = useState<add_Hotel_Detail_Interface | null>({
      hotel_Id: null,
      hotel_Name: null,
      hotel_Image_List: [],
      // distance: string,
      totalRating: null,
      facility_List: null,
      price: null,
      hotel_Intro: null,
      address: null,
      country: null,
      city: null,
      tax: null,
      checkin: null,
      checkout: null,
      latitude: null,
      longtitude: null,
      is_Open: null,
      hotel_Phone: null,
      hotel_Email: null,
      cancellation_Policy: null,
      transportation: null,
      recommendation: null,
      review_List: [],
      roomType_List: []
  })
  const get_The_Hotel_Data = (id: string | null) => {
    const the_Found_Hotel = redux_Hotel_List.find((item) => item.hotel_Id === id);
    // 3.1 找不到 the_Found_Hotel, 還是要返回 一個帶有初始值物件, 不然會返回 undefined...
    if(!the_Found_Hotel) {
      set_The_Editing_Hotel({
        hotel_Id: null,
        hotel_Name: null,
        hotel_Image_List: [],
        // distance: string,
        totalRating: null,
        facility_List: null,
        price: null,
        hotel_Intro: null,
        address: null,
        country: null,
        city: null,
        tax: null,
        checkin: null,
        checkout: null,
        latitude: null,
        longtitude: null,
        is_Open: null,
        hotel_Phone: null,
        hotel_Email: null,
        cancellation_Policy: null,
        transportation: null,
        recommendation: null,
        review_List: [],
        roomType_List: []
      });
      return;
    }
    // 3.2 如果有找到, 就傳 the_Found_Hotel 數據
    if(the_Found_Hotel) {
      set_The_Editing_Hotel(the_Found_Hotel)
      console.log(the_Editing_Hotel, "準備被編輯之飯店");
    }
  }

  // 4. 刪除指定飯店
  const dispatch: AppDispatch = useDispatch();
  const remove_The_Hotel = (id: string) => {
    const new_redux_Hotel_List = redux_Hotel_List.filter((item) => {
      return item.hotel_Id !== id
    });
  }



  return <>
  
  {/** 顯示2筆飯店，可編輯刪除 */}
      <div className="rounded-b border-l border-r boder-b border-softGray overflow-hidden">
        <table className="w-full table-auto ">
          <thead className="bg-lightGray">
            <tr className="text-left">
              <th className="border-b border-softGray p-2">HOTEL</th>
              <th className="border-b border-softGray p-2">LOCATION</th>
              <th className="border-b border-softGray p-2">ROOMS</th>
              <th className="border-b border-softGray p-2">STATUS</th>
              <th className="border-b border-softGray p-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {redux_Hotel_List.map((item, index) => {
              return <tr key={index}>
              <td className="border-b border-softGray p-2">
                <div className="flex items-center gap-2">
                  {/* <img src={`${item.hotel_Image_List[0]?.url}`} alt="" className="w-10 rounded"/> */}
                  <p>{item.hotel_Name}</p>
                </div>
              </td>
              <td className="border-b border-softGray p-2">{item.country}</td>
              <td className="border-b border-softGray p-2">暫無此數據</td>
              <td className="border-b border-softGray p-2">Active</td>
              <td className="border-b border-softGray p-2 ">
                <div className="flex gap-2">
                  
                  {/** 編輯飯店 */}
                  <div onClick={() => get_The_Hotel_Data(item.hotel_Id)}>
                    <button type="button" onClick={open_Modal}>
                      <DashboardSVG name={"edit"} className="w-4 h-auto"></DashboardSVG>
                    </button>
                  </div>
                  <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
                    <Edit_Hotel_List_Modal the_Editing_Hotel={the_Editing_Hotel} onClose={close_Modal}></Edit_Hotel_List_Modal>
                  </Modal>
                   {/** 編輯飯店 */}
                  
                  <DashboardSVG name={"delete"} className="w-4 h-auto"></DashboardSVG>

                </div>
              </td>
            </tr>

            })}
          </tbody>
        </table>
      </div>
      {/** 顯示2筆飯店，可編輯刪除 */}
  
  </>
}