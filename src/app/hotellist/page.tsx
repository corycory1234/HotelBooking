'use client';
import BackPage from "@/components/back-Page/backPage";
import Server_Form_Search from "@/components/server-Form-Search/server-Form-Search";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Client_Filter_Button from "@/components/client-Filter-Button";

export default function HotelList () {
  // 1.  這些Params都來自於 Server Action - Submit_Form函式
  // 1.1 必須要對接這些Params, /hotellist?destination...路由, 才可以運作
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  // const dateRange = searchParams.get("dateRange");
  const room = searchParams.get("room");
  const adult = searchParams.get("adult");
  const child = searchParams.get("child");
  const timestamp = searchParams.get("timestamp");

  // 2. 監聽 Params
  useEffect(() => {
    console.log(destination, room, adult, child, timestamp);
  },[destination, room, adult, child, timestamp])

  return <>
  <title>HOTEL</title>
    <BackPage></BackPage>


<div className="fixed top-[56px] left-0 right-0 bg-white z-40 border-b border-gray-100">
  {/* Filter 與 熱門搜尋條件 */}
    <Client_Filter_Button></Client_Filter_Button>
  {/* Filter 與 熱門搜尋條件 */}


</div>
<main className="pt-28 px-4 pb-4">
  <div className="flex items-center justify-between mb-4">
    <p className="text-sm text-gray-500">245 hotels found</p>
    <select className="text-sm border-none bg-transparent">
      <option>Sort by: Recommended</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
      <option>Guest Rating</option>
    </select>
  </div>
  <div className="space-y-4">
    <article className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src="/hotellist/hotellist_1.webp" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">The Ritz-Carlton</h3>
            <p className="text-sm text-gray-500 mt-1">Downtown • 0.5 mi from center</p>
          </div>
          <div className="flex items-center gap-1 bg-custom/10 text-custom px-2 py-1 rounded">
            <i className="fas fa-star text-xs"></i>
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Pool</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Spa</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Restaurant</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-semibold">$599</span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
          <button className="bg-custom text-white px-4 py-2 rounded-lg text-sm font-medium !rounded-button">Book Now</button>
        </div>
      </div>
    </article>
    <article className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src="/hotellist/hotellist_2.webp" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Four Seasons Hotel</h3>
            <p className="text-sm text-gray-500 mt-1">Waterfront • 1.2 mi from center</p>
          </div>
          <div className="flex items-center gap-1 bg-custom/10 text-custom px-2 py-1 rounded">
            <i className="fas fa-star text-xs"></i>
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Beach</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Gym</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Bar</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-semibold">$799</span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
          <button className="bg-custom text-white px-4 py-2 rounded-lg text-sm font-medium !rounded-button">Book Now</button>
        </div>
      </div>
    </article>
    <article className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src="/hotellist/hotellist_3.webp" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Mandarin Oriental</h3>
            <p className="text-sm text-gray-500 mt-1">Marina Bay • 2.0 mi from center</p>
          </div>
          <div className="flex items-center gap-1 bg-custom/10 text-custom px-2 py-1 rounded">
            <i className="fas fa-star text-xs"></i>
            <span className="text-sm font-medium">4.7</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Pool</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Spa</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">WiFi</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-semibold">$699</span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
          <button className="bg-custom text-white px-4 py-2 rounded-lg text-sm font-medium !rounded-button">Book Now</button>
        </div>
      </div>
    </article>
  </div>
</main>

  </>
}