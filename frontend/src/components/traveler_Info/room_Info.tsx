import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { HomeSVG } from "@/components/client_Svg/client_Svg";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import how_Many_Nights from "@/utils/how_Many_Nights";
import { useTranslations } from "next-intl";


export default function Room_Info () {
  // 2. Redux - 飯店明細, props傳遞給<Swiper_Hotel_Detail>
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);

  // 3. Redux - 搜尋參數, <Form>旅客表單 需要人數、日期
  const redux_Fomr_Search = useSelector((state: RootState) => state.formSearch);

  // 4. 住幾個晚上
  const nights = how_Many_Nights(redux_Fomr_Search.dateRange?.slice(0,10) as string, redux_Fomr_Search.dateRange?.slice(13) as string)
  // console.log("幾晚", nights);

  // 5. Redux - 被預訂飯店之之數據
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  console.log(redux_Booked_Room, "Redux - 被預訂之房型");

  // 6. next-intl i18n-翻譯
  const t = useTranslations("TravelerInfo");


  return <>
  
  {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}
      <div className="flex flex-col pb-4 border border-softGray rounded p-4 gap-4 lg:hidden">
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
          <p className="text-lg font-semibold">{t (redux_Booked_Room.room_Type)}</p>
            {/** 吸菸|禁菸 */}
            {redux_Booked_Room.smoke === true ? 
            <div className="flex gap-2 bg-softGray p-1 rounded text-sm">
              <OtherSVG name={"smoking"} className="w-4 h-auto"></OtherSVG> 
              {t ("Smoking")}
            </div> 
            : <div className="flex gap-2 bg-softGray p-1 rounded text-sm">
              <OtherSVG name={"nosmoking"} className="w-4 h-auto"></OtherSVG> 
              {t ("No-Smoking")}
            </div>}
            {/** 吸菸|禁菸 */}
        </div>
        {/** 房型 */}

        {/** 入住時間 */}
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <OtherSVG name={"time"} className="w-4 h-auto"></OtherSVG>
            <p>{t ("Check In")}</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.dateRange?.slice(0,10) + ` ${t ("After")} ${redux_Hotel_Detail.checkin?.slice(0,5)}`}</p>
        </div>
        {/** 入住時間 */}
        
        {/** 退房時間 */}
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <OtherSVG name={"time"} className="w-4 h-auto"></OtherSVG>
            <p>{t ("Check Out")}</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.dateRange?.slice(13) + ` ${t ("Before")} ${redux_Hotel_Detail.checkout?.slice(0,5)}`} </p>
        </div>
        {/** 退房時間 */}
        
        {/** 幾間房 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"bed"} className="w-4 h-auto"></OtherSVG>
            <p>{t ("Number of Rooms")}</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{redux_Fomr_Search.room + t ("Rooms")}</p>
        </div>
        {/** 幾間房 */}

        {/** 住幾晚 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"night"} className="w-4 h-auto"></OtherSVG>
            <p>{t ("Number of Nights")}</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{nights + t ("Nights")}</p>
        </div>
        {/** 住幾晚 */}

        {/** 住幾人 */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <OtherSVG name={"user"} className="w-4 h-auto"></OtherSVG>
            <p>{t ("Number of People")}</p>
          </div>
          <p className="text-sm font-semibold pl-[28px]">{`${redux_Fomr_Search.adult}  ${t ("Adults")}`} {`${redux_Fomr_Search.child >0 ? redux_Fomr_Search.child + t('Childs')  : ''}`}</p>
        </div>
        {/** 住幾人 */}
        
      </div>
      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}
  
  </>
}