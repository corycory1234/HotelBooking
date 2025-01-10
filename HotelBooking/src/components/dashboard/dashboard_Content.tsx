import { DashboardSVG } from "../client_Svg/client_Svg";
import { HomeSVG } from "../client_Svg/client_Svg";
import { OtherSVG } from "../client_Svg/client_Svg";

const dashboard_Svg = ["Total Bookings", "Revenue", "Active Promotions", "Pending Reviews"];

export default function Dashboard_Content() {
  return <>
    <div className="px-4 flex flex-col gap-4 bg-lightGray">

      {/** 頂部顯示4個主要數據 */}
      <div className="flex gap-2" >
        {dashboard_Svg.map((item, index) => {
          return <>
            <div className="border border-softGray rounded flex items-center gap-2 p-2 basis-1/4" key={index}>
              <DashboardSVG name={item} className="w-6 h-auto"></DashboardSVG>
              <div className="flex flex-col">
                <p className="text-sm text-gray">{item}</p>
                <p className="text-sm font-semibold">1,482</p>
              </div>
            </div>
          </>
        })}
      </div>
      {/** 頂部顯示4個主要數據 */}

      {/** 新增飯店 */}
      <div className="flex justify-between items-center">
        <p>Hotel Management</p>
        <button className="bg-black text-white rounded p-2">+ Add new Hotel</button>
      </div>
      {/** 新增飯店 */}
      
      {/** 顯示2筆飯店，可編輯刪除 */}
      <div>
        <table className="w-full table-auto border-collapse border-l border-r border-black">
          <thead className="bg-lightGray">
            <tr className="text-left">
              <th className="border-b border-gray">HOTEL</th>
              <th className="border-b border-gray">LOCATION</th>
              <th className="border-b border-gray">ROOMS</th>
              <th className="border-b border-gray">STATUS</th>
              <th className="border-b border-gray">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="border-b border-gray">
                <div className="flex items-center gap-2">
                  <img src="/home/Popular_1.webp" alt="" className="w-10 rounded"/>
                  <p>Grand President Hotel Bangkok</p>
                </div>
              </td>
              <td className="border-b border-gray">Bangkok</td>
              <td className="border-b border-gray">50</td>
              <td className="border-b border-gray">Active</td>
              <td className="border-b border-gray ">
                <div className="flex gap-2">
                  <DashboardSVG name={"edit"} className="w-4 h-auto"></DashboardSVG>
                  <DashboardSVG name={"delete"} className="w-4 h-auto"></DashboardSVG>

                </div>
              </td>
              
            </tr>
            <tr>
              <td className="border-b border-gray">
                <div className="flex items-center gap-2">
                  <img src="/home/Popular_2.webp" alt="" className="w-10 rounded"/>
                  <p>Josh Hotel</p>
                </div>
              </td>
              <td className="border-b border-gray">China</td>
              <td className="border-b border-gray">172</td>
              <td className="border-b border-gray">Closed</td>
              <td className="border-b border-gray">
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
              <button className="border border-gray rounded p-2 ">Reply</button>
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
              <button className="border border-gray rounded p-2 ">Reply</button>
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



      </div>



    </div>
  </>
}