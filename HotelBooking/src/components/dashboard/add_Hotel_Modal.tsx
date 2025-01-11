import { useState } from "react";
import { add_Hotel_Detail_Interface, add_Review_Type_Interface } from "@/types/add_Hotel_Detail";
import { v4 as uuidv4 } from 'uuid'; 

// 1. 設施初始值
const facilities = ["beach", "gym", "bar", 
  "wifi" ,"ktv", "pickup", "24hrcheckin","laundry",  "water", 
  "slipper", "ac", "pool", "spa", "meal"
];

// 2. 各種房型初始值
const roomType_List = ["singleRoom", "doubleRoom", "twinRoom", "queenRoom", "kingRoom"];

// 3. 房型內設施初始值
const amenity = ["shower", "bathtub", "breakfast", "tv", ];

export default function Add_Hotel_Modal() {
  
  // 1. 所有飯店列表
  const [hotel_List, set_Hotel_List] = useState<add_Hotel_Detail_Interface[]>([]);

  // 2. 留言日期
  const [date, set_Date] = useState((new Date()).toLocaleDateString());
  // console.log(date, "今天");

  const submit = (formData: FormData) => {
    // 3. <form> 拿數據
    const hotel_Id = (hotel_List.length +1).toString(); // 自定義id, 從hotel_List長度去拉
    const hotel_Name = formData.get("hotelname") as string | null;
    const address = formData.get("address") as string | null;
    const city = formData.get("city") as string | null;
    const country = formData.get("country") as string | null;
    const price = formData.get("price") ? Number(formData.get("price")) : null;
    const tax = formData.get("tax") ? Number(formData.get("tax")) : null;
    const totalRating = formData.get("totalrating") ? Number(formData.get("totalrating")) : null;
    const checkin = formData.get("checkin") as string | null;
    const checkout = formData.get("checkout") as string | null;
    const facilitiy_List = formData.getAll("facilities") as string[] | null;
    const intro = formData.get("intro") as string | null;
    const hotelimFiles = formData.getAll("hotelimages") as File[];
    const hotel_Image_List = hotelimFiles.map((item) => ({
      url: URL.createObjectURL(item),
      description: "",
    }))
    const travelername = formData.get("travelername") as string | null;
    const date = formData.get("date") as string | null;
    const traveler_Rating = formData.get("rating") as string | null;
    const comment = formData.get("comment") as string | null;
    const roomtype = formData.get("roomtype");
    const roomprice = formData.get("roomprice")
    const availability = formData.get("availability");
    const smoke = formData.get("smoke");
    const amenity = formData.getAll("amenity");
    const roomsize = formData.get("roomsize");
    const maxpeople = formData.get("maxpeople");

    
  // 4. 添加評論函數 (這函式要UI去按按鈕才會觸發)
  // 4.1 在酒店列表中，每個酒店項目下添加一個評論表單，當用戶提交評論時，
  // 4.2 調用 addReview 函數來更新特定酒店的 reviews
  const addReview = (hotelId: string, travelerName: string, date: string, traveler_Rating: number, comment: string) => {
    const newReview: add_Review_Type_Interface = {
      travelerId: uuidv4(), // 使用 UUID 生成唯一 ID
      travelerName,
      date,
      traveler_Rating,
      comment,
    };
    // 4.3 這邊很複雜
    set_Hotel_List((prevHotels) => 
      prevHotels.map((hotel) => {
        return hotel.hotel_Id === hotelId ? { ...hotel, review_List: [...hotel.review_List, newReview] } : hotel
      })
    );
  };

    // 5. 評論表單Array & 單一旅客評論 - 初始值
    let initialReviews_List: add_Review_Type_Interface[] = [];
    if (travelername && date && traveler_Rating && comment) {
    initialReviews_List.push({
        travelerId: uuidv4(),
        travelerName: travelername,
        date: date,
        traveler_Rating: + traveler_Rating,
        comment: comment,
      });
    };

    // 6. 構建新的酒店物件
    const new_Hotel: add_Hotel_Detail_Interface = {
      hotel_Id: hotel_Id,
      hotel_Name: hotel_Name,
      address: address,
      city: city,
      country: country,
      price: price,
      tax: tax,
      totalRating: totalRating,
      checkin: checkin,
      checkout: checkout,
      facility_List: facilitiy_List,
      hotel_Intro: intro,
      hotel_Image_List: hotel_Image_List,
      review_List: initialReviews_List,
    };


    // 7. 更新 hotel_List 最新狀態
    set_Hotel_List((prevState) => [...prevState, new_Hotel]);
    console.log(hotel_List);
  }

  
  return <div className="flex flex-col p-4 gap-4 bg-lightGray">
    <p className="text-lg font-bold">Add New Hotel</p>

    <form action={submit} className="flex flex-col gap-4">

      <div className="flex flex-col bg-white rounded border border-softGray p-2 gap-2">
        <p className="font-semibold text-primary">Basic Information</p>

        {/** 酒店名、地址 */}
        <div className="flex">
          <div className="basis-1/2 flex gap-2">
            <label htmlFor="hotelname">Hotel Name</label>
            <input type="text" id="hotelname" name="hotelname" className="border rounded" />
          </div>
          <div className="basis-1/2 flex gap-2">
            <label htmlFor="address">Address</label>
            <input type="text" id="address"name="address"className="border rounded"/>
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
            <input type="text" id="country"name="country"className="border rounded"/>
          </div>
        </div>
        {/** 城市、國家*/}
        
        {/** 飯店最小價錢 ?、稅Tax、飯店星級平價(初始值 0)*/}
        <div className="flex gap-2">
          <div className="flex gap-2">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" name="price" className="border rounded no-spin max-w-20"/>
          </div>
          <div className="flex gap-2">
            <label htmlFor="tax">Tax %</label>
            <input type="number" id="tax" name="tax" step="0.01" className="border rounded no-spin max-w-20"/>
          </div>
          <div className="flex gap-2">
            <label htmlFor="totalrating">totalRating</label>
            <input type="number" id="totalrating"name="totalrating"className="border rounded no-spin max-w-20"/>
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
        
        {/** 上傳飯店輪播圖 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="hotelimages" className="font-semibold text-primary">Upload Images</label>
          <input type="file" id="hotelimages" name="hotelimages" accept="images/*"
          multiple className="border rounded" />
        </div>
        {/** 上傳飯店輪播圖 */}
        
        {/** 旅客留言、評價 */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-primary">Comment</p>
          <div className="flex gap-2">
            <label htmlFor="travelername">Name</label>
            <input type="text" id="travelername" name="travelername" className="border rounded"/>
            <label htmlFor="date">Date</label>
            <input type="text" readOnly id="date" name="date" className="border rounded" value={date}/>
            <label htmlFor="rating">Rating</label>
            <select name="rating" id="rating" className="border rounded">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <textarea name="comment" id="comment" className="border rounded"></textarea>
        </div>
        {/** 旅客留言、評價 */}
          
      </div>
      




      {/** 創建房型 */}
      <div className="flex flex-col bg-white rounded border border-softGray p-2 gap-2">
        <p className="font-semibold text-primary">Room Type</p>
        
        {/** 選擇房型 */}
        <label htmlFor="roomtype" className="font-semibold">Select Room Type</label>
        <select name="roomtype" id="roomtype" className="border rounded">
          {roomType_List.map((room) => {
            return <option key={room} value={room}>
              {room.charAt(0).toUpperCase() + room.slice(1)}
            </option>
          })}
        </select>
        {/** 選擇房型 */}
        
        {/** 房型價錢、 該房型共幾間、吸菸房*/}
        <div className="flex gap-2">
          <div className="flex gap-2">
            <label htmlFor="roomprice">Price</label>
            <input type="number" id="roomprice" name="roomprice" className="border rounded no-spin max-w-20"/>
          </div>
          <div className="flex gap-2">
            <label htmlFor="availability">Availability 該房型共幾間</label>
            <input type="number" id="availability" name="availability" className="border rounded no-spin max-w-20"/>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="smoke" name="smoke" value={"smokingroom"}/>
            <label htmlFor="smoke">Smoking Room</label>
          </div>
        </div>
        {/** 房型價錢、 該房型共幾間、吸菸房 */}
        

        {/** 房間內設施 */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-primary">Amenity</p>
            <div className="flex gap-2">
              {amenity.map((amenity) => {
                return <div className="flex gap-2" key={amenity}>
                  <input type="checkbox" id={amenity} name="amenity" value={amenity}/>
                  <label htmlFor={amenity}>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</label>
                </div>
              })}
            </div>
        </div>
        {/** 房間內設施 */}
        
        
        {/** 房型大小、最多住幾人 */}
        <div className="flex gap-2">
          <div className="flex gap-2">
            <label htmlFor="roomsize">Room Size {` (㎡)`} </label>
            <input type="number" id="roomsize" name="roomsize" className="border rounded no-spin max-w-20"/>
          </div>

          <div className="flex gap-2">
            <label htmlFor="maxpeople">Max People</label>
            <input type="number" id="maxpeople" name="maxpeople" className="border rounded no-spin max-w-20"/>
          </div>
        </div>
        {/** 房型大小、最多住幾人 */}





      </div>
      {/** 創建房型 */}




















      {/** 傳送formData 給後端 Server */}
      <div className="flex justify-center">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded mt-4">
          Submit
        </button>
      </div>
      {/** 傳送formData 給後端 Server */}

    </form>
  </div>
}