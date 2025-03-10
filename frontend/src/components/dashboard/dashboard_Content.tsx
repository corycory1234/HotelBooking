'use client';
import { useState } from "react";
import { DashboardSVG } from "../client_Svg/client_Svg";
import { HomeSVG } from "../client_Svg/client_Svg";
import { OtherSVG } from "../client_Svg/client_Svg";
import Modal from "../modal/modal";
import Add_Hotel_Modal from "./add_Hotel_Modal";

const dashboard_Svg = ["Total Bookings", "Revenue", "Active Promotions", "Pending Reviews"];

export default function Dashboard_Content() {
  // 1. 打開  Modal視窗
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false);
  const open_Modal = (  ) => {
    set_Modal_Boolean(!modal_Boolean);
  }


  return <>
    <div className="p-4 flex flex-col gap-5 bg-lightGray">

      {/** 頂部顯示4個主要數據 */}
      <div className="flex gap-2" >
        {dashboard_Svg.map((item, index) => {
          return <div className="border border-softGray rounded flex items-center gap-2 p-2 basis-1/4" key={index}>
              <DashboardSVG name={item} className="w-6 h-auto"></DashboardSVG>
              <div className="flex flex-col">
                <p className="text-sm text-gray">{item}</p>
                <p className="text-sm font-semibold">1,482</p>
              </div>
            </div>
          
        })}
      </div>
      {/** 頂部顯示4個主要數據 */}

      {/** 新增飯店 */}
      <div className="flex justify-between items-center">
        <p>Hotel Management</p>
        <button className="bg-black text-white rounded p-2" onClick={open_Modal}>+ Add new Hotel</button>
      </div>
      <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
        <Add_Hotel_Modal></Add_Hotel_Modal>
      </Modal>
      {/** 新增飯店 */}
      
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
            <tr>
              <td className="border-b border-softGray p-2">
                <div className="flex items-center gap-2">
                  <img src="/home/Popular_1.webp" alt="" className="w-10 rounded"/>
                  <p>Grand President Hotel Bangkok</p>
                </div>
              </td>
              <td className="border-b border-softGray p-2">Bangkok</td>
              <td className="border-b border-softGray p-2">50</td>
              <td className="border-b border-softGray p-2">Active</td>
              <td className="border-b border-softGray p-2 ">
                <div className="flex gap-2">
                  <DashboardSVG name={"edit"} className="w-4 h-auto"></DashboardSVG>
                  <DashboardSVG name={"delete"} className="w-4 h-auto"></DashboardSVG>

                </div>
              </td>
              
            </tr>
            <tr>
              <td className="border-b border-softGray p-2">
                <div className="flex items-center gap-2">
                  <img src="/home/Popular_2.webp" alt="" className="w-10 rounded"/>
                  <p>Josh Hotel</p>
                </div>
              </td>
              <td className="border-b border-softGray p-2">China</td>
              <td className="border-b border-softGray p-2">172</td>
              <td className="border-b border-softGray p-2">Closed</td>
              <td className="border-b border-softGray p-2">
              <div className="flex gap-2">
                <DashboardSVG name={"edit"} className="w-4 h-auto"></DashboardSVG>
                <DashboardSVG name={"delete"} className="w-4 h-auto"></DashboardSVG>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/** 顯示2筆飯店，可編輯刪除 */}



      <div className="flex gap-4">

        {/** 最新2筆評論 */}
        <div className="basis-1/2 flex flex-col gap-2 rounded p-2 bg-white">
          <p>Recent Reviews</p>

          <div className="flex flex-col gap-2 py-2 border-b border-softGray">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="rounded-full bg-gray p-4">
                  <OtherSVG name={"user"} className="w-4 h-auto"></OtherSVG>
                </div>
                <div className="flex flex-col">
                  <p>Sarah</p>
                  <div className="flex">
                    <HomeSVG name="Star" className="w-4 h-auto"></HomeSVG>
                    <HomeSVG name="Star" className="w-4 h-auto"></HomeSVG>
                    <HomeSVG name="Star" className="w-4 h-auto"></HomeSVG>
                    <HomeSVG name="Star" className="w-4 h-auto"></HomeSVG>
                  </div>
                </div>
              </div> 
              <p>2 hours ago</p>
            </div>
              <p>Excellent stay! The staff was very attentive and the rooms were immaculate. Will definitely return.</p>
                
              {/** 回覆留言 */}
              <button className="border border-gray rounded py-2 w-1/4">
                <div className="flex justify-center items-center gap-2">
                  <DashboardSVG name={"reply"} className="w-4 h-auto"></DashboardSVG>Reply
                </div>
              </button>
              {/** 回覆留言 */}
          </div>

            <div className="flex flex-col gap-2 py-2 border-b border-softGray">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <div className="rounded-full bg-gray p-4">
                    <OtherSVG name={"user"} className="w-4 h-auto"></OtherSVG>
                  </div>
                  <div className="flex flex-col">
                    <p>Ray</p>
                    <div className="flex">
                      <HomeSVG name="Star" className="w-4 h-auto"></HomeSVG>
                      <HomeSVG name="Star" className="w-4 h-auto"></HomeSVG>
                      <HomeSVG name="Star" className="w-4 h-auto"></HomeSVG>
                    </div>
                  </div>
                </div>
                <p>2 hours ago</p>
              </div>
              <p>Great location and amenities. The breakfast could be improved though.</p>
                
                {/** 回覆留言 */}
                <button className="border border-gray rounded py-2 w-1/4">
                  <div className="flex justify-center items-center gap-2">
                    <DashboardSVG name={"reply"} className="w-4 h-auto"></DashboardSVG>Reply
                  </div>
                </button>
                {/** 回覆留言 */}
            </div>
        </div>
        {/** 最新2筆評論 */}



        {/** 最新2筆訂單 */}
        <div className="basis-1/2 flex flex-col gap-2 p-2 bg-white rounded">
          <p>Recent Bookins</p>

          <div className="flex flex-col gap-2 border-b py-2 border-softGray">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p>Deluxe Room - Grand Plaza Hotel</p>
                <p>Dec 12 - Dec 15, 2023</p>
              </div>
              <p className="bg-primary rounded text-white px-2 py-4">Confirmed</p>
            </div>
            <div className="flex gap-2">
              <OtherSVG name={"user"} className="w-4 h-auto fill-black"></OtherSVG>
              <p>Robert Williams</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b py-2 border-softGray">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p>Suite - Boutique Resort & Spa</p>
                <p>Dec 18 - Dec 20, 2023</p>
              </div>
              <p className="bg-amber-200 rounded text-amber-700 px-2 py-4">Pending</p>
            </div>
            <div className="flex gap-2">
              <OtherSVG name={"user"} className="w-4 h-auto fill-black"></OtherSVG>
              <p>Emma Thompson</p>
            </div>
          </div>

        </div>
        {/** 最新2筆訂單 */}


      </div>



    </div>
  </>
}