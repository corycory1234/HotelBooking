import { useState, useEffect } from "react";
import { add_Hotel_Detail_Interface, add_Review_Type_Interface, add_Hotel_Room_Type_Interface } from "@/types/add_Hotel_Detail";
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

  // 3. 指定飯店 - 所有房型列表
  const [roomTypes, set_RoomTypes] = useState<add_Hotel_Room_Type_Interface[]>([
    // {
    //   room_Type: "",
    //   roomType_Id: uuidv4(),
    //   room_Price: null,
    //   room_Availability: null,
    //   smoke: null,
    //   amenity_List: [],
    //   room_Size: null,
    //   max_People: null,
    //   roomType_Image_List: [],
    // }
  ])

  // 4. 再新增一個房型
  const add_Room_Type = () => {
    set_RoomTypes([...roomTypes, {
      room_Type: "",
      roomType_Id: uuidv4(),
      room_Price: null,
      room_Availability: null,
      smoke: null,
      amenity_List: [],
      room_Size: null,
      max_People: null,
      roomType_Image_List: []
    }])
  };

  // 5. 組件載入時，預先加一個房型
  useEffect(() => {
    add_Room_Type()
  },[])

  // 5. 移除房型
  const remove_Room_Type = (index: number) => {
    set_RoomTypes(roomTypes.filter((_, i) => i !== index))
  };

  // 6. 處理房型表單變更
  const handle_Room_Type_Change = (index: number, field: keyof add_Hotel_Room_Type_Interface, value: any) => {
    const updateRoomTypes = roomTypes.map((room, i) => 
      i === index ? {...room, [field]: value} : room
    );
    set_RoomTypes(updateRoomTypes)
  }
  
  // 7. 提交 <form> 函式
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event?.currentTarget);

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
    const room_Type = formData.get("roomtype") as string | null;;
    const room_Price = formData.get("roomprice") as number | null;
    const room_Availability = formData.get("availability") as number | null;;
    const smoke = formData.get("smoke") as string | null; // 打勾是"on" 或者 沒勾是 null
    const amenity_List = formData.getAll("amenity") as string[] | null;;
    const room_Size = formData.get("roomsize") as number | null;;
    const max_People = formData.get("maxpeople") as number | null;;
    const roomTypeFiles = formData.getAll("roomtypeimages") as File[];
    const roomType_Image_List = roomTypeFiles.map((item) => ({
      url: URL.createObjectURL(item),
      description: "",
    }))

    
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

    // 6. 眾多房型Array & 單一房型 - 初始值
    // let initialRoomType_List: add_Hotel_Room_Type_Interface[] = [];
    // if(room_Type && room_Price && room_Availability && smoke && amenity_List && room_Size && max_People && roomType_Image_List){
    //   initialRoomType_List.push({
    //     room_Type: room_Type,
    //     roomType_Id: uuidv4(),
    //     room_Price: room_Price,
    //     room_Availability: room_Availability,
    //     smoke: smoke,
    //     amenity_List: amenity_List,
    //     room_Size: room_Size,
    //     max_People: max_People,
    //     roomType_Image_List: roomType_Image_List
    //   })
    // }

    // 6. 眾多房型Array & 單一房型 - 初始值
    const initialRoomType_List = roomTypes

    // 7. 構建新的酒店物件
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
      roomType_List: initialRoomType_List,
    };


    // 7. 更新 hotel_List 最新狀態
    set_Hotel_List((prevState) => [...prevState, new_Hotel]);
    console.log(hotel_List);
  }

  
  return <div className="flex flex-col p-4 gap-4 bg-lightGray">
    <p className="text-lg font-bold">Add New Hotel</p>

    <form onSubmit={submit} className="flex flex-col gap-4">

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

        {roomTypes.map((roomType, index) => {
          return <div key={roomType.roomType_Id} className="flex flex-col bg-gray-100 rounded border border-gray-300 p-2 gap-2 mb-2">
            <h4 className="font-semibold">Room Type {index + 1}</h4>



        {/** 選擇房型 */}
        <label htmlFor={`roomtype_${roomType.roomType_Id}`} className="font-semibold">Select Room Type</label>
        <select name={`roomtype[${index}].room_Type`} id={`roomtype_${roomType.roomType_Id}`} className="border rounded" 
        value={roomType.room_Type} onChange={(event) => handle_Room_Type_Change(index, "room_Type", event.target.value)} required>
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
            <label htmlFor={`roomprice_${roomType.roomType_Id}`}>Price</label>
            <input type="number" id={`roomprice_${roomType.roomType_Id}`} name={`roomTypes[${index}].room_Price`} className="border rounded no-spin max-w-20"
            value={roomType.room_Price ?? ""} 
            onChange={(event) => handle_Room_Type_Change(index, "room_Price", event.target.value ? Number(event.target.value) : null)}
            required/>
          </div>
          <div className="flex gap-2">
            <label htmlFor={`availability_${roomType.roomType_Id}`}>Availability 該房型共幾間</label>
            <input type="number" id={`availability_${roomType.roomType_Id}`} name={`roomTypes[${index}].room_Availability`} className="border rounded no-spin max-w-20"
            value={roomType.room_Availability ?? ""}
            onChange={(event) => handle_Room_Type_Change(index, "room_Availability", event.target.value ? Number(event.target.value): null)}
            required/>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id={`smoke_${roomType.roomType_Id}`} name={`roomTypes[${index}].smoke`}
            checked={roomType.smoke === "smokingroom"} value={"smokingroom"}
            onChange={(event) => handle_Room_Type_Change(index, "smoke", event.target.checked ? "smokingroom" : "non-smoking")}/>
            <label htmlFor={`smoke_${roomType.roomType_Id}`}>Smoking Room</label>
          </div>
        </div>
        {/** 房型價錢、 該房型共幾間、吸菸房 */}
        

        {/** 房間內設施 */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-primary">Amenity</p>
            <div className="flex gap-2">
              {amenity.map((amenity) => {
                return <div className="flex gap-2" key={amenity}>
                  <input type="checkbox" id={`${amenity}_${roomType.roomType_Id}`} name={`roomTypes[${index}].amenity_List`} 
                  value={amenity} 
                  checked={roomType.amenity_List?.includes(amenity) ?? false}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    let updatedAmenities = roomType.amenity_List
                      ? [...roomType.amenity_List]
                      : [];
                    if (isChecked) {
                      updatedAmenities.push(amenity);
                    } else {
                      updatedAmenities = updatedAmenities.filter(
                        (a) => a !== amenity
                      );
                    }
                    handle_Room_Type_Change(
                      index,
                      "amenity_List",
                      updatedAmenities
                    );
                  }}/>
                  <label htmlFor={`${amenity}_${roomType.roomType_Id}`}>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</label>
                </div>
              })}
            </div>
        </div>
        {/** 房間內設施 */}
        
        
        {/** 房型大小、最多住幾人 */}
        <div className="flex gap-2">
          <div className="flex gap-2">
            <label htmlFor={`roomsize_${roomType.roomType_Id}`}>Room Size {` (㎡)`} </label>
            <input type="number" id={`roomsize_${roomType.roomType_Id}`} name={`roomTypes[${index}].room_Size`} className="border rounded no-spin max-w-20"
            value={roomType.room_Size ?? ""}
            onChange={(event) => handle_Room_Type_Change(index, "room_Size", event.target.value ? Number(event.target.value): null)}
            required/>
          </div>

          <div className="flex gap-2">
            <label htmlFor={`maxpeople_${roomType.roomType_Id}`}>Max People</label>
            <input type="number"  id={`maxpeople_${roomType.roomType_Id}`}  name={`roomTypes[${index}].max_People`} className="border rounded no-spin max-w-20"
            value={roomType.max_People ?? ""}
            onChange={(event) => handle_Room_Type_Change(index, "max_People", event.target.value ? Number(event.target.value) : null)}
            required/>
          </div>
        </div>
        {/** 房型大小、最多住幾人 */}

        {/** 上傳房型輪播圖 */}
        <div className="flex flex-col gap-2">
          <label htmlFor={`roomtypeimages_${roomType.roomType_Id}`} className="font-semibold text-primary">Upload Images</label>
          <input type="file"  id={`roomtypeimages_${roomType.roomType_Id}`}  name={`roomTypes[${index}].room_Image_List`} accept="images/*"
          multiple className="border rounded" 
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              const imageList = files.map((file) => ({
                url: URL.createObjectURL(file),
                description: "",
              }));
              handle_Room_Type_Change(
                index,
                "roomType_Image_List",
                imageList
              );
            }
          }}/>
        </div>
        {/** 上傳房型輪播圖 */}

        
           {/* 添加房型按鈕 */}
          <button type="button" onClick={add_Room_Type} className="bg-primary text-white px-4 py-2 rounded">
            再新增一個房型
          </button>



          </div>
        })}
        






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