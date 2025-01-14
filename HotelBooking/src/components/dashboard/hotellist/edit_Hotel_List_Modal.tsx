'use client';
import { useState, useEffect } from "react";
import { add_Hotel_Detail_Interface, add_Hotel_Room_Type_Interface } from "@/types/add_Hotel_Detail"
import { edit_One_Hotel } from "@/store/cms/Hotel_List_Slice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { v4 as uuidv4 } from 'uuid';

// 1. hotel_List_Contet 父傳子 props 傳遞之接口
interface Editing_Hotel_Interface {
  the_Editing_Hotel: add_Hotel_Detail_Interface | null;
  // 1.1 新增關閉 Modal 之函式
  onClose: () => void 
};

// 2. 設施初始值
const facilities = ["beach", "gym", "bar", 
  "wifi" ,"ktv", "pickup", "24hrcheckin","laundry",  "water", 
  "slipper", "ac", "pool", "spa", "meal"
];

// 3. 各種房型初始值
const roomType_List = ["singleRoom", "doubleRoom", "twinRoom", "queenRoom", "kingRoom"];

// 4. 房型內設施初始值
const amenity = ["shower", "bathtub", "breakfast", "tv", ];



export default function Edit_Hotel_List_Modal ({the_Editing_Hotel, onClose}: Editing_Hotel_Interface) {
  console.log(the_Editing_Hotel, "傳給Modal - 編輯視窗");
  
  // 5. dipatch 旨在呼叫 Redux - Action函式 
  const dispatch: AppDispatch = useDispatch();
  
  // 6. 本地 formData, 管理 <form>表單 裡面所有的<input>、<select>等等
  const [formData, set_FomrData] = useState<add_Hotel_Detail_Interface | null>(null);

  // 7. 如果拿到 the_Editing_Hotel(有值時), 就{展開運算子}, 帶入給 formData
  useEffect(() => {
    if(the_Editing_Hotel) {
      set_FomrData({...the_Editing_Hotel})
    }
  },[the_Editing_Hotel]);

  // 8. <input> 或 <select> 當中的 onChange事件，其可以改變值, 若value綁定了formData(父元件props過來的數據), 
  // 8.1 value={} 一定要搭配 onChange, 不然無法修改值, 因為是不可控(GPT的詮釋) 
  // 8.2 另外, 因為太多<input>, 統一寫成函式, 再綁 onChange
  const handle_Change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if(!formData) return;
    // 8.3 把<input name= value=>, 都解構出來
    const {name, value} = event.target;

    // 8.4 如果不是拿「設施陣列」數據, 才走以下
    // 8.5 [name]: value, 會去對照 hotel_Id: "2", price: 99, checkin: "11:00"...之類
    // 8.5 但這種方法對應不了巢狀, 像"facility_List" 若照上述方法走, facility_List: [] 會對應不到value
    // 8.5 因為 facility_List 是 陣列包字串
    if(event.target.name !== "facilities") {
      set_FomrData({...formData, [name]: value});
      return;
    };
  };

  // 9. 搭配 <input type="checkbox"> 寫法, 這樣 event.target.checked就可以找到
  // 9.1 上面寫法找不到, 是因為吃太多ChangeEvent...
  const handle_Checkbox_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const checked = event.target.checked; // 只有 checkbox 才有 checked
    const facility_Value = event.target.value; // 這是 checkbox 的 value
    // 9.2 確保 facility_List 是陣列，如果是 null 就給它空陣列
    let new_Facilities = formData.facility_List ?? [];

    // 9.4 若打勾，加入該 facility
    if(checked) {
      if(!new_Facilities.includes(facility_Value)) {
        new_Facilities = [...new_Facilities, facility_Value]
      }
    } else {
      // 9.5 若取消勾選，移除該 facility
      new_Facilities = new_Facilities.filter((item) => item !== facility_Value)
    };

    // 9.6 最後更新 formData, 主要針對 facility_List 更新
    set_FomrData({...formData, facility_List: new_Facilities})
  };

  // 10. 輪播圖渲染於 <form> - 失敗, 待有空解決
  const [image_Files, set_Image_Files] = useState<File[]>([]);
  const handle_Blob_Image_Files_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files) return;
    // 10.1 將 Blob - Image 圖片轉陣列
    const selectedFiles = Array.from(event.target.files);
    set_Image_Files(selectedFiles);
  };

  // 11. review_List: [{留言1},{留言2}] 之 onChange 函式
  const handle_Review_List_Change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => {
    if(!formData) return;
    const {name, value} = event.target;
    // 11.1 拷貝原本的 review_List, 底下2個展開運算子要注意
    const new_Review_List = [...formData.review_List];
    new_Review_List[index] = {...new_Review_List[index], [name]: value};
    // 11.2 更新 formData
    set_FomrData({...formData, review_List: new_Review_List});
  };


  // 12. 處理房型表單變更 >> 指定飯店 - 所有房型列表
  const handle_Room_Type_Change = (index: number, field: keyof add_Hotel_Room_Type_Interface, newValue: any) => {
    if(!formData) return;
    // 12.1 拷貝原先的 roomType_List
    const old_Room_Types = formData.roomType_List ?? [];
    // 12.2 修改指定 房型 (帶入index做辨認)
    const updateRoomTypes = {...old_Room_Types[index], [field]: newValue};
    // 12.3 重新組合
    const new_Room_Types = [...old_Room_Types];
    new_Room_Types[index] = updateRoomTypes;
    // 12.4 更新 formData
    set_FomrData({...formData, roomType_List: new_Room_Types});
  };

  // 13. 再新增一個房型 - 函式
  const add_Room_Type = () => {
    if(!formData) return;
    const old_Room_Type_List = formData.roomType_List ?? [];
    // 13.1 準備一個預設的 roomType 物件
    const new_Room_Type: add_Hotel_Room_Type_Interface = {
      room_Type: "singleRoom",
      roomType_Id: uuidv4(),
      room_Price: null,
      room_Availability: null,
      smoke: null,
      amenity_List: [],
      room_Size: null,
      max_People: null,
      roomType_Image_List: []
    };
    // 13.2 新房型陣列, 展開運算子舊房型列表, 再於[]最後面補上「新房型-物件」
    const new_Room_Type_List = [...old_Room_Type_List, new_Room_Type];
    set_FomrData({...formData, roomType_List: new_Room_Type_List})
  };

  // 14. 刪除指定房型
  const remove_Room_Type = (index: number) => {
    if(!formData) return;
    const old_Room_Type_List = formData.roomType_List ?? [];
    const new_Room_Type_List = [...old_Room_Type_List];
    new_Room_Type_List.splice(index, 1)
    // 10.1 刪除完, 要立馬更新本地狀態, 再呼叫 dispatch 去更新 Redux, 最後自動關閉
    const update_FormData = {...formData, roomType_List: new_Room_Type_List};
    set_FomrData(update_FormData);
    dispatch(edit_One_Hotel(update_FormData))
    onClose();
  }
  

  // 15. 最後 - <form> 表單送出所有數據
  const handle_Submit = (event: React.FormEvent) => {
    event.preventDefault();
    if(formData) {
      dispatch(edit_One_Hotel(formData));
      onClose() // 關閉 Modal
    }
  };

  // 16. 如果沒有數據，暫時不渲染
  if (!formData) return null;


  return <>

  <div className="flex flex-col p-4 gap-4 bg-lightGray">
      <p className="text-lg font-bold">Edit Hotel</p>
      <form className="flex flex-col gap-4" onSubmit={handle_Submit}>
        <div className="flex flex-col bg-white rounded border border-softGray p-2 gap-2">
          <p className="font-semibold text-primary">Basic Information</p>
  
    {/** 基本飯店資訊 */}

    {/** 酒店名、地址 */}
    <div className="flex">
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="hotel_Name">Hotel Name</label>
        <input type="text" id="hotel_Name" name="hotel_Name" className="border rounded"
          value={formData.hotel_Name ?? ""}
          onChange={handle_Change}
          />
      </div>
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" className="border rounded" 
          value={formData.address ?? ""}
          onChange={handle_Change}
          />
      </div>
    </div>
    {/** 酒店名、地址 */}

    {/** 城市、國家*/}
    <div className="flex">
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" className="border rounded" 
          value={formData.city ?? ""}
          onChange={handle_Change}/>
      </div>
      <div className="basis-1/2 flex gap-2">
        <label htmlFor="country">Country</label>
        <input type="text" id="country" name="country" className="border rounded" 
          value={formData.country ?? ""}
          onChange={handle_Change}/>
      </div>
    </div>
    {/** 城市、國家*/}

    {/** 飯店最小價錢 ?、稅Tax、飯店星級平價(初始值 0)*/}
    <div className="flex gap-2">
      <div className="flex gap-2">
        <label htmlFor="price">Price</label>
        <input type="number" id="price" name="price" className="border rounded no-spin max-w-20" 
          value={formData.price ?? 0}
          onChange={handle_Change}/>
      </div>
      <div className="flex gap-2">
        <label htmlFor="tax">Tax %</label>
        <input type="number" id="tax" name="tax" step="0.01" className="border rounded no-spin max-w-20" 
          value={formData.tax ?? 0}
          onChange={handle_Change}/>
      </div>
      <div className="flex gap-2">
        <label htmlFor="totalRating">totalRating</label>
        <input type="number" id="totalRating" name="totalRating" className="border rounded no-spin max-w-20" 
          value={formData.totalRating ?? 0}
          onChange={handle_Change}/>
      </div>
    </div>
    {/** 飯店最小價錢 ?、稅Tax、飯店星級平價(初始值 0)*/}

    {/** 入住、退房時間 */}
    <div className="flex gap-2">
      <label htmlFor="checkin">Check-in Time</label>
      <select id="checkin" name="checkin" className="border rounded"
        value={formData.checkin ?? ""}
        onChange={handle_Change}>
        {Array.from({ length: 24 }, (_, hour) => [
          `${hour.toString().padStart(2, "0")}:00`,
          `${hour.toString().padStart(2, "0")}:30`,
        ]).flat().map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>


      <label htmlFor="checkout">Check-out Time</label>
      <select id="checkout" name="checkout" className="border rounded"
        value={formData.checkout ?? ""}
        onChange={handle_Change}>
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
          <div key={facility} >
            <label className="flex items-center gap-2">
              <input type="checkbox" id={facility} name="facilities" value={facility} 
              checked={formData.facility_List?.includes((facility) ?? false)}
              onChange={handle_Checkbox_Change}/>
              {facility.charAt(0).toUpperCase() + facility.slice(1)}</label>
          </div>
        ))}
      </div>
    </div>
    {/** 設施 */}


    {/** 飯店介紹 */}
    <div className="flex flex-col gap-2">
      <label htmlFor="hotel_Intro" className="font-semibold text-primary">Introduction</label>
      <textarea name="hotel_Intro" id="hotel_Intro" className="border rounded"
        value={formData.hotel_Intro ?? ""}
        onChange={handle_Change}></textarea>
    </div>
    {/** 飯店介紹 */}

    {/** 上傳飯店輪播圖 - 失敗, 待有空解決 */}
    <div className="flex flex-col gap-2">
      <label htmlFor="hotelimages" className="font-semibold text-primary">Upload Images</label>
      <input type="file" id="hotelimages" name="hotelimages" accept="images/*"
        multiple className="border rounded" />
        {/* {formData.hotel_Image_List.map((item) => {
          return <div key={item.url}>
            <img src={item.url} alt="" />
          </div>
        })} */}
    </div>
    {/** 上傳飯店輪播圖 - 失敗, 待有空解決*/}


          {/** 基本飯店資訊 */}
          


          {/** 旅客留言、評價 */}
            <div className="flex flex-col gap-2">
                <p className="font-semibold text-primary">Comment</p>
                  {formData.review_List.map((item, index) => {
                    return <div key={item.travelerId}>
                    <div className="flex gap-2" >
                      <label htmlFor="travelerName">Name</label>
                      <input type="text" id="travelerName" name="travelerName" className="border rounded"
                        value={item.travelerName} onChange={(event) => handle_Review_List_Change(event, index)}/>
                      <label htmlFor="date">Date</label>
                      <input type="text" id="date" name="date" className="border rounded" 
                      value={item.date} onChange={(event) => handle_Review_List_Change(event, index)}/>
                      <label htmlFor="traveler_Rating">Rating</label>
                      <select name="traveler_Rating" id="traveler_Rating" className="border rounded" value={item?.traveler_Rating ?? ""}
                        onChange={(event) => handle_Review_List_Change(event, index)}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </div>
                    <textarea name="comment" id="comment" className="border rounded" 
                      value={item.comment} onChange={(event) => handle_Review_List_Change(event, index)}></textarea>
                    
                    </div>
                  })}

              </div>
              {/** 旅客留言、評價 */}
        </div>
        





      {/** 創建房型 */}
      <div className="flex flex-col bg-white rounded border border-softGray p-2 gap-2">
        <p className="font-semibold text-primary">Room Type</p>

        {formData.roomType_List.map((roomType, index) => {
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
                  <label className="flex gap-2">
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

                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </label>
                  
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
          <button type="button" onClick={() => remove_Room_Type(index)} className="bg-customRed text-white px-4 py-2 rounded">
            刪除此房型
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
  
  
  </>
}