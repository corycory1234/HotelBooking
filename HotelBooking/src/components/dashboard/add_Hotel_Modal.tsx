const facilities = ["beach", "gym", "bar", 
  "wifi" ,"ktv", "pickup", "checkin","laundry", 
  "tv", "water", "slipper", "ac", "pool", "spa", "meal"
];

export default function Add_Hotel_Modal() {

  
  return <div className="flex flex-col p-4 gap-4 bg-lightGray">
    <p className="text-lg font-bold">Add New Hotel</p>

    <form action="" className="flex flex-col gap-4">

      <div className="flex flex-col bg-white rounded border border-softGray p-2 gap-2">
        <p className="font-semibold">Basic Information</p>

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
            <input type="text" id="city" name="hotelname" className="border rounded" />
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
            <label htmlFor="rating">Tax %</label>
            <input type="number" id="tax" name="tax" step="0.01" className="border rounded no-spin max-w-20"/>
          </div>
          <div className="flex gap-2">
            <label htmlFor="rating">Rating</label>
            <input type="number" id="rating"name="rating"className="border rounded no-spin max-w-20"/>
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
          <p className="font-semibold">Facilities</p>
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
          <label htmlFor="intro" className="font-semibold">Introduction</label>
          <textarea name="intro" id="intro" className="border rounded"></textarea>
        </div>
        {/** 飯店介紹 */}


      </div>




      <div className="flex justify-center">
        <button type="button" className="bg-primary text-white px-4 py-2 rounded mt-4">
          Submit
        </button>
      </div>

    </form>
  </div>
}