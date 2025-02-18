'use client';
import { useState, useEffect } from "react";
import { add_Hotel_Detail_Interface, add_Review_Type_Interface, add_Hotel_Room_Type_Interface } from "@/types/add_Hotel_Detail";
import { create_Hotel_Interface, create_Review_Interface, create_Hotel_Room_Type_Interface } from "@/types/create_Hotel";
import { v4 as uuidv4 } from 'uuid';
import Add_Hotel_Basic_Info from "./add_Hotel_Basic_Info"; 
import Add_Hotel_Review from "./add_Hotel_Review";
import { useSelector, useDispatch } from "react-redux";
import { add_One_Hotel } from "@/store/cms/Hotel_List_Slice";
import { RootState, AppDispatch } from "@/store/store";


// 2. 各種房型初始值
const roomType_List = ["singleroom", "doubleroom", "twinroom", "queenroom", "kingoom"];

// 3. 房型內設施初始值
const amenity = ["shower", "bathtub", "breakfast", "tv", ];

// 4. 房型景觀初始值
const room_View_List = ["sea view", "forest view", "city view", "lake view", "street view", "mountain view"]

// 5. 床型
const bed_Type_List = ["single bed", "double bed", "queen bed", "king bed" ,"twin beds", "tatami"]

export default function Add_Hotel_Modal() {
  const dispatch: AppDispatch = useDispatch();
  const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List);
  console.log(redux_Hotel_List, "Redux - 飯店列表");
  
  // 1. 所有飯店列表
  const [hotel_List, set_Hotel_List] = useState<create_Hotel_Interface[]>([]);


  // 3. 指定飯店 - 所有房型列表
  const [roomTypes, set_RoomTypes] = useState<create_Hotel_Room_Type_Interface[]>([])

  // 4. 再新增一個房型 - 函式
  const add_Room_Type = () => {
    set_RoomTypes([...roomTypes, {
      room_Type: "singleRoom",
      roomType_Id: uuidv4(),
      view: "sea view",
      bed_Type: "single bed",
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

  // 6. 移除房型
  const remove_Room_Type = (index: number) => {
    set_RoomTypes(roomTypes.filter((_, i) => i !== index))
  };

  // 7. 處理房型表單變更
  const handle_Room_Type_Change = (index: number, field: keyof create_Hotel_Room_Type_Interface, value: any) => {
    const updateRoomTypes = roomTypes.map((room, i) => 
      i === index ? {...room, [field]: value} : room
    );
    set_RoomTypes(updateRoomTypes)
  }
  
  // 8. 提交 <form> 函式
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event?.currentTarget);

    // 9. <form> 拿數據
    const hotel_Id = (redux_Hotel_List.length +1).toString(); // 自定義id, 從hotel_List長度去拉
    const hotel_Name = formData.get("hotelname") as string | null;
    const address = formData.get("address") as string | null;
    const city = formData.get("city") as string | null;
    const country = formData.get("country") as string | null;
    const price = formData.get("price") ? Number(formData.get("price")) : null;
    const tax = formData.get("tax") ? Number(formData.get("tax")) : null;
    const totalRating = formData.get("totalrating") ? Number(formData.get("totalrating")) : null;
    const checkin = formData.get("checkin") as string | null;
    const checkout = formData.get("checkout") as string | null;
    const latitude = formData.get("latitude") as string | null;
    const longtitude = formData.get("longtitude") as string | null;
    const is_Open = formData.get("is_Open") as string | null;
    const hotel_Phone = formData.get("hotel_Phone") as string | null;
    const hotel_Email = formData.get("hotel_Email") as string | null;
    const cancellation_Policy = formData.get("cancellation_Policy") as string | null;
    const facilitiy_List = formData.getAll("facilities") as string[] | null;
    const intro = formData.get("intro") as string | null;
    const transportation = formData.get("transportation") as string | null;
    const recommendation = formData.get("recommendation") as string | null;
    const hotel_Image_Files = formData.getAll("hotelimages") as File[];
    const room_Type_Image_Files = formData.getAll("roomtypeimages") as File[];
    // 9.1 待Daniel 修正完 上傳圖片API, 這可以拿掉 ↓
    // const hotel_Image_List = hotel_Image_Files.map((item) => ({
    //   url: URL.createObjectURL(item),
    //   description: "",
    // }))
    // 9.2 建立新的 FormData 用來上傳圖片, 上傳圖片API 修正完要用的變數↓
    const hotel_Image_List_Form_Data = new FormData();
    const room_Type_Image_List_Form_Data = new FormData();
    hotel_Image_Files.forEach((file) => {hotel_Image_List_Form_Data.append("images", file)});
    room_Type_Image_Files.forEach((file) => {room_Type_Image_List_Form_Data.append("images", file)});
    
    const travelername = formData.get("travelername") as string | null;
    const date = formData.get("date") as string | null;
    const traveler_Rating = formData.get("rating") as string | null;
    const comment = formData.get("comment") as string | null;
    const reply = formData.get("reply") as string | null;
    const room_Type = formData.get("roomtype") as string | null;;
    const room_Price = formData.get("roomprice") as number | null;
    const room_Availability = formData.get("availability") as number | null;;
    const smoke = formData.get("smoke") as string | null; // 打勾是"on" 或者 沒勾是 null
    const amenity_List = formData.getAll("amenity") as string[] | null;;
    const room_Size = formData.get("roomsize") as number | null;;
    const max_People = formData.get("maxpeople") as number | null;;
    // const roomTypeFiles = formData.getAll("roomtypeimages") as File[];
    // const roomType_Image_List = roomTypeFiles.map((item) => ({
    //   url: URL.createObjectURL(item),
    //   description: "",
    // }));
    const distance = formData.get("distance") as string;
    // 9.1 offer 送出, 必須是物件, 因此若有拿到value, 先斷言是string, 記得先小括號包起來, 外層再Parse; 
    // 9.2 沒拿到就返回null, 這樣可解決 TS報null的問題
    // const offer = formData.get("offer") ? JSON.parse(formData.get("offer") as string) : null
    const offer = formData.get("offer") as string;
    
  // 10. 添加評論函數 (這函式要UI去按按鈕才會觸發)
  // 10.1 在酒店列表中，每個酒店項目下添加一個評論表單，當用戶提交評論時，
  // 10.2 調用 addReview 函數來更新特定酒店的 reviews
  const addReview = (hotelId: string, travelerName: string, date: string, traveler_Rating: number, comment: string, reply: string) => {
    const newReview: create_Review_Interface = {
      travelerId: uuidv4(), // 使用 UUID 生成唯一 ID
      travelerName,
      date,
      traveler_Rating,
      comment,
      reply,
    };
    // 10.3 如果ID匹配正確, 展開運算子指定Hotel(是物件), 
    // 10.3 並將原先評論列表(是陣列) 也展開運算子, 後面將 newReview 補進新陣列裡面
    // 10.3 若ID不匹配的話, 就保持原先 : hotel  
    set_Hotel_List((prevHotels) => 
      prevHotels.map((hotel) => {
        return hotel.hotel_Id === hotelId ? { ...hotel, review_List: [...hotel.review_List, newReview] } : hotel
      })
    );
  };

    // 11. 評論表單Array & 單一旅客評論 - 初始值
    let initialReviews_List: create_Review_Interface[] = [];
    if (travelername && date && traveler_Rating && comment) {
    initialReviews_List.push({
        travelerId: uuidv4(),
        travelerName: travelername,
        date: date,
        traveler_Rating: + traveler_Rating,
        comment: comment,
        reply: reply,
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

    // 12. 眾多房型Array & 單一房型 - 初始值
    const initialRoomType_List = roomTypes

    // 13. 不要丟「房型圖片」, 抑或是給他空陣列, 不然資料庫會有空物件...
    const roomTypesForCreation = roomTypes.map(room => {
      const { roomType_Image_List, ...rest } = room; // 排除 roomType_Image_List
      return {
        ...rest,
        roomType_Image_List: [] // 或者可以完全省略這個欄位，視後端需求而定
      }
    });

    // 13. 創建新的飯店物件
    const new_Hotel = {
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
      latitude: latitude,
      longtitude: longtitude,
      is_Open: is_Open,
      hotel_Phone: hotel_Phone,
      hotel_Email: hotel_Email,
      cancellation_Policy: cancellation_Policy,
      facility_List: facilitiy_List,
      hotel_Intro: intro,
      transportation: transportation,
      recommendation: recommendation,
      // hotel_Image_List: hotel_Image_List,
      review_List: initialReviews_List,
      // roomType_List: initialRoomType_List,
      roomType_List: roomTypesForCreation,
      distance: distance,
      isCollected: false,
      offer_Id: offer,
    };

    console.log(new_Hotel, "檢查傳出去數據");

    // 15. 創建飯店 API
    const create_Hotel_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/hotels";
    try {
      const response = await fetch(create_Hotel_Url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(new_Hotel),
        credentials: "include" // 同源政策 CORS 需要
      });
      const data = await response.json();
      console.log(data, "查看創建飯店API", data.data.hotel.hotel_Id, "查看飯店ID");
      const hotel_Id = data.data.hotel.hotel_Id;
      const room_Type_List = data.data.rooms;

      // 16. 上傳飯店照片 API
      const upload_Hotel_Image_List_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels/${hotel_Id}/images`
      const hotel_Image_Lits_Response = await fetch(upload_Hotel_Image_List_Url, {
        method: "POST",
        body: hotel_Image_List_Form_Data,
        credentials: "include"
      });
      const data2 = await hotel_Image_Lits_Response.json();
      console.log(data2, "查看上傳房店照片API回應");

      // 17. 上傳房型照片 API
      room_Type_List.forEach(async (item: any, index: number) => {
        const roomType_Id = item.roomType_Id
        const upload_Room_Type_Image_List_Url = process.env.NEXT_PUBLIC_API_BASE_URL + `/hotels/room-types/${roomType_Id}/images`;
          // 從 state 中針對每個房型取得上傳的檔案
          // 注意：這邊要確保 roomTypes[index].roomType_Image_List 是 File[] 而非預覽用的 blob URL
        const files = roomTypes[index].roomType_Image_List as File[];

        if (files && files.length > 0) {
          const room_Type_Image_List_Form_Data = new FormData();
          files.forEach((file) => {
            room_Type_Image_List_Form_Data.append("images", file);
          });
        
        const room_Type_Image_List_Response = await fetch(upload_Room_Type_Image_List_Url, {
          method: "POST",
          body: room_Type_Image_List_Form_Data,
          credentials: "include"
        });
      const data3 = await room_Type_Image_List_Response.json()
      console.log(data3, "查看上傳房型照片 API回應");
      }
      })
    }
    catch (error) {
      console.log(error);
    }


    // 14. 最後，更新 hotel_List 最新狀態
    // set_Hotel_List((prevState) => [...prevState, new_Hotel]);
    // console.log(hotel_List);
    // dispatch(add_One_Hotel(new_Hotel));
    // console.log("Redux - 飯店列表", redux_Hotel_List);
  }

  
  return <div className="flex flex-col p-4 gap-4 bg-lightGray">
    <p className="text-lg font-bold">Add New Hotel</p>

    <form onSubmit={submit} className="flex flex-col gap-4">

      <div className="flex flex-col bg-white rounded border border-softGray p-2 gap-2">
        <p className="font-semibold text-primary">Basic Information</p>

        {/** 基本飯店資訊 */}
        <Add_Hotel_Basic_Info></Add_Hotel_Basic_Info>
        {/** 基本飯店資訊 */}
        
        {/** 旅客留言、評價 */}
        <Add_Hotel_Review></Add_Hotel_Review>
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
        <select name={`roomtype[${index}].room_Type`} id={`roomtype_${roomType.roomType_Id}`} className="border rounded py-2" 
        value={roomType.room_Type} onChange={(event) => handle_Room_Type_Change(index, "room_Type", event.target.value)} required>
          {roomType_List.map((room) => {
            return <option key={room} value={room}>
              {room.charAt(0).toUpperCase() + room.slice(1)}
            </option>
          })}
        </select>
        {/** 選擇房型 */}

        {/** 選擇房型景觀 */}
        <label htmlFor={`roomtype_${roomType.roomType_Id}`} className="font-semibold">Select Room View</label>
        <select name={`roomtype[${index}].view`} id={`roomtype_${roomType.roomType_Id}`} className="border rounded py-2" 
          value={roomType.view ?? ""} onChange={(event) => handle_Room_Type_Change(index, "view", event.target.value)} required>
          {room_View_List.map((view) => {
            return <option key={view} value={view}>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </option>
          })}
        </select>
         {/** 選擇房型景觀 */}


        {/** 選擇床型 */}
        <label htmlFor={`roomtype_${roomType.roomType_Id}`} className="font-semibold">Select Bed Type</label>
        <select name={`roomtype[${index}].bed_Type`} id={`roomtype_${roomType.roomType_Id}`} className="border rounded py-2" 
          value={roomType.bed_Type ?? ""} onChange={(event) => handle_Room_Type_Change(index, "bed_Type", event.target.value)} required>
          {bed_Type_List.map((bed_Type) => {
            return <option key={bed_Type} value={bed_Type}>
              {bed_Type.charAt(0).toUpperCase() + bed_Type.slice(1)}
            </option>
          })}
        </select>
         {/** 選擇床型 */}
        
        
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
          <input type="file"  id={`roomtypeimages_${roomType.roomType_Id}`}  name={`roomtypeimages_${roomType.roomType_Id}`} accept="images/*"
          multiple className="border rounded" 
          // onChange={(e) => {
          //   if (e.target.files) {
          //     const files = Array.from(e.target.files);
          //     const imageList = files.map((file) => ({
          //       url: URL.createObjectURL(file),
          //       description: "",
          //     }));
          //     handle_Room_Type_Change(
          //       index,
          //       "roomType_Image_List",
          //       imageList
          //     );
          //   }
          // }}
          onChange={(event) => {
            if(event.target.files){
              const files = Array.from(event.target.files);
              handle_Room_Type_Change(index, "roomType_Image_List",files);
            }
          }}
          />
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