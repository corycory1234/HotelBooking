import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { HomeSVG } from "@/components/client_Svg/client_Svg";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import how_Many_Nights from "@/utils/how_Many_Nights";


export default function Room_Info () {
  // 2. Redux - 飯店明細, props傳遞給<Swiper_Hotel_Detail>
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);

  // 3. Redux - 搜尋參數, <Form>旅客表單 需要人數、日期
  const redux_Fomr_Search = useSelector((state: RootState) => state.formSearch);

  // 4. 住幾個晚上
  const nights = how_Many_Nights(redux_Fomr_Search.dateRange?.slice(0,10), redux_Fomr_Search.dateRange?.slice(13))
  console.log("幾晚", nights);

  // 5. Redux - 被預訂飯店之之數據
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  console.log(redux_Booked_Room, "Redux - 被預訂之房型");


  return <>
  
  {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}
      <div className="flex flex-col pb-4 border border-softGray rounded p-4 gap-4">
        <div className="flex justify-between flex-wrap">
          <p className="font-bold text-xl">{redux_Hotel_Detail.hotel_Name}</p>
          <div className="flex items-center gap-x-1">
            <HomeSVG name={"Star"} className="w-3 h-auto"></HomeSVG>
            <p className="text-xs text-gray">{redux_Hotel_Detail?.totalRating}</p>
            <p className="text-xs text-gray">({redux_Hotel_Detail?.review_List.length + " reviews"})</p>
          </div>
        </div>
        <p className="text-xs text-gray">{redux_Hotel_Detail.address}</p>

        {/** 房型 */}
        <div className="flex gap-2">
          <p className="text-lg font-semibold">{redux_Booked_Room.room_Type.charAt(0).toUpperCase() + redux_Booked_Room.room_Type.slice(1)}</p>
            {/** 吸菸|禁菸 */}
            {redux_Booked_Room.smoke ? 
            <div className="flex gap-2 bg-softGray p-1 rounded text-sm">
              <OtherSVG name={"smoking"} className="w-4 h-auto"></OtherSVG> 
              Smoking Room
            </div> 
            : <div className="flex gap-2 bg-softGray p-1 rounded text-sm">
              <OtherSVG name={"nosmoking"} className="w-4 h-auto"></OtherSVG> 
              No-Smoking
            </div>}
            {/** 吸菸|禁菸 */}
        </div>
        {/** 房型 */}

        {/** 入住時間 */}
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <OtherSVG name={"time"} className="w-4 h-auto"></OtherSVG>
            <p>Chekc In</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.dateRange?.slice(0,10) + ` After ${redux_Hotel_Detail.checkin}`}</p>
        </div>
        {/** 入住時間 */}
        
        {/** 退房時間 */}
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <OtherSVG name={"time"} className="w-4 h-auto"></OtherSVG>
            <p>Chekc Out</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.dateRange?.slice(13) + ` Before ${redux_Hotel_Detail.checkout}`} </p>
        </div>
        {/** 退房時間 */}
        
        {/** 幾間房 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"bed"} className="w-4 h-auto"></OtherSVG>
            <p>Number of Roooms</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.room + " Room(s)"}</p>
        </div>
        {/** 幾間房 */}

        {/** 住幾晚 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"night"} className="w-4 h-auto"></OtherSVG>
            <p>Number of Nights</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{nights + " Night(s)"}</p>
        </div>
        {/** 住幾晚 */}

        {/** 住幾人 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"user"} className="w-4 h-auto"></OtherSVG>
            <p>Number of People</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{`${redux_Fomr_Search.adult}  Adult(s)`} {`${redux_Fomr_Search.child >0 ? redux_Fomr_Search.child + ' Child(s)'  : ''}`}</p>
        </div>
        {/** 住幾人 */}
        
      </div>
      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}
  
  </>
}