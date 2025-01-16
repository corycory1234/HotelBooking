// 1. 設施初始值
const facilities = ["beach", "gym", "bar", 
  "wifi" ,"ktv", "pickup", "24hrcheckin","laundry",  "water", 
  "slipper", "ac", "pool", "spa", "meal"
];

export default function Add_Hotel_Basic_Info() {

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
        <input type="number" id="latitude" name="latitude" className="border rounded no-spin max-w-20"
        step="any"/>
      </label>
      <label className="flex gap-2">
        Longtitude
        <input type="number" id="longtitude" name="longtitude" className="border rounded no-spin max-w-20"
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

    {/** 上傳飯店輪播圖 */}
    <div className="flex flex-col gap-2">
      <label htmlFor="hotelimages" className="font-semibold text-primary">Upload Images</label>
      <input type="file" id="hotelimages" name="hotelimages" accept="images/*"
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



  </>
}