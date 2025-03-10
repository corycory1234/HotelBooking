import { useEffect, useState } from "react";
import offer_List_Json from "@/fakeData/offer_List.json";

// 1. 設施初始值
const facilities = ["beach", "gym", "bar", 
  "wifi" ,"ktv", "pickup", "24hrcheckin","laundry",  "water", 
  "slipper", "ac", "pool", "spa", "meal"
];

export default function Add_Hotel_Basic_Info() {
  // 2. 推薦景點 - 本地State
  const [recommendation_List, set_Recommendation_List] = useState<string[]>([]);
  // 3. onChange事件, 參數必須做好TS辨別
  const handle_Change_Recommendation = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const new_recommendation_List = [...recommendation_List]; // 必須做好展開運算子
    new_recommendation_List[index] = event.target.value; // [新一筆景點] = 最新的target.value
    set_Recommendation_List(new_recommendation_List) // 再更新 本地state狀態
  }
  // 4. 新增一筆景點 - 函式
  // const add_One_Recommendation = () => {
  //   set_Recommendation_List([...recommendation_List, ""])
  // }

  // 5. 一進頁面, 先給個預設1筆 <textarea> for 景點
  // useEffect(() => {
  //   add_One_Recommendation()
  // },[])

  return <>

    {/** 酒店名、地址 */}
    <div className="flex">
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="hotelname">Hotel Name</label>
        <input type="text" id="hotelname" name="hotelname" className="border rounded" />
      </div>
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" className="border rounded" />
      </div>
    </div>
    {/** 酒店名、地址 */}

    {/** 城市、國家*/}
    <div className="flex">
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" className="border rounded" />
      </div>
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="country">Country</label>
        <input type="text" id="country" name="country" className="border rounded" />
      </div>
    </div>
    {/** 城市、國家*/}

    {/** 飯店最小價錢 ?、稅Tax、飯店星級平價(初始值 0)*/}
    <div className="flex gap-2">
      <div className="flex gap-2">
        <label htmlFor="price">Price</label>
        <input type="number" id="price" name="price" className="border rounded no-spin max-w-20" />
      </div>
      <div className="flex gap-2">
        <label htmlFor="tax">Tax %</label>
        <input type="number" id="tax" name="tax" step="0.01" className="border rounded no-spin max-w-20" />
      </div>
      <div className="flex gap-2">
        <label htmlFor="totalrating">totalRating</label>
        <input type="number" id="totalrating" name="totalrating" className="border rounded no-spin max-w-20" />
      </div>
    </div>
    {/** 飯店最小價錢 ?、稅Tax、飯店星級平價(初始值 0)*/}

    {/** 入住、退房時間 */}
    <div className="flex gap-2">
      <label htmlFor="checkin">Check-in Time</label>
      <select id="checkin" name="checkin" className="border rounded">
        {Array.from({ length: 24 }, (_, hour) => [
          `${hour.toString().padStart(2, "0")}:00`,
          `${hour.toString().padStart(2, "0")}:30`,
        ]).flat().map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>


      <label htmlFor="checkout">Check-out Time</label>
      <select id="checkout" name="checkout" className="border rounded">
        {Array.from({ length: 24 }, (_, hour) => [
          `${hour.toString().padStart(2, "0")}:00`,
          `${hour.toString().padStart(2, "0")}:30`,
        ]).flat().map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
    </div>
    {/** 入住、退房時間 */}

    {/** 經緯度 */}     
    <div className="flex gap-2">
      <label className="flex gap-2">
        Latitude
        <input type="string" 
          id="latitude" name="latitude" className="border rounded no-spin w-1/2 flex-1"
        step="any"/>
      </label>
      <label className="flex gap-2">
        longitude
        <input type="string"
          id="longitude" name="longitude" className="border rounded no-spin w-1/2 flex-1"
        step="any"/>
      </label>
    </div>
    {/** 經緯度 */}

    {/** 是否營業 */}
    <div className="flex gap-2">
      <label className="flex gap-2">
        Is OPEN ?
        <select name="is_Open" id="is_Open" className="border rounded">
          <option value="open">Open</option>
          <option value="close">Close</option>
        </select>
        </label>
    </div>
    {/** 是否營業 */}

    {/** 飯店電話、飯店郵件 */}
    <div className="flex gap-2">
      <label className="flex gap-2">
        Hotel Phone
        <input type="text" id="hotel_Phone" name="hotel_Phone" className="border rounded"/>
      </label>

      <label className="flex gap-2">
        Hotel Email
        <input type="text" id="hotel_Email" name="hotel_Email" className="border rounded"/>
      </label>
    </div>
    {/** 飯店電話、飯店郵件 */}

    {/** 設施 */}
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-primary">Facilities</p>
      <div className="flex flex-wrap gap-2">
        {facilities.map((facility) => (
          <div key={facility} className="flex items-center gap-2">
            <input type="checkbox" id={facility} name="facilities" value={facility} />
            <label htmlFor={facility}>{facility.charAt(0).toUpperCase() + facility.slice(1)}</label>
          </div>
        ))}
      </div>
    </div>
    {/** 設施 */}


    {/** 飯店介紹 */}
    <div className="flex flex-col gap-2">
      <label htmlFor="intro" className="font-semibold text-primary">Introduction</label>
      <textarea name="intro" id="intro" className="border rounded"></textarea>
    </div>
    {/** 飯店介紹 */}


    {/** 鄰近交通 */}
    <div className="flex flex-col gap-2">
      <label htmlFor="transportation" className="font-semibold text-primary">Transportation</label>
      <textarea name="transportation" id="transportation" className="border rounded"></textarea>
    </div>
    {/** 鄰近交通 */}

    {/** 推薦景點 */}
    <div className="flex flex-col gap-2">
      <label htmlFor="recommendation" className="font-semibold text-primary">Recommendation</label>
      <textarea name="recommendation" id="recommendation" className="border rounded"></textarea>
    </div>
    {/** 推薦景點 */}


    {/** 上傳飯店輪播圖 */}
    <div className="flex flex-col gap-2">
      <label htmlFor="hotelimages" className="font-semibold text-primary">Upload Images</label>
      <input type="file" id="hotelimages" name="hotelimages" accept="image/*"
        multiple className="border rounded" />
    </div>
    {/** 上傳飯店輪播圖 */}

    {/** 取消政策 */}
      <label className="flex flex-col gap-2">
        <p className="text-primary font-semibold">Cancellation Policy</p>
        <textarea name="cancellation_Policy" id="cancellation_Policy" 
          className="rounded border w-full h-auto" rows={4}>
        </textarea>
      </label>
    {/** 取消政策 */}


    {/** 飯店離某些地標之距離 */}
      <label className="flex flex-col gap-2">
        <p className="text-primary font-semibold">Distance</p>
        <textarea name="distance" id="distance" 
          className="rounded border w-full h-auto" rows={4}>
        </textarea>
      </label>
    {/** 飯店離某些地標之距離 */}
    

    {/** 飯店優惠券 - 只能選1張 */}
      <div className="flex flex-col gap-2">
        <label>
          <p className="text-primary font-semibold">Offers</p>
          <select name="offer" id="offer" className="border rounded py-2">
            {offer_List_Json.map((offer) => {
              return <option value={offer.offer_Id} key={offer.offer_Id}>
                {offer.offer_Name}
                </option>
            })}
          </select>
        </label>
      </div>
    {/** 飯店優惠券 - 只能選1張 */}



  </>
}