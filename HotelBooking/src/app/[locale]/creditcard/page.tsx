'use client';
import Previous_Page from "@/components/previous_Page/previous_Page";
import Credit_Card_List from "@/components/credit_Card/credit_Card_List";
import Form_Credit_Card from "@/components/credit_Card/form_Credit_Card";
import { useState } from "react";
import { OtherSVG, ProfileSVG } from "@/components/client_Svg/client_Svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { sleep } from "@/utils/sleep";
import StarRating from "@/components/starrating/star-Rating";
import how_Many_Nights from "@/utils/how_Many_Nights";
import Offer_List_Json from "@/fakeData/offer_List.json";
import Payment_Progress_Bar from "@/components/payment_Progress_Bar/payment_Progress_Bar";
import { useTranslations } from "next-intl";
import { useApiRequest } from "@/hooks/useApiRequest";


// 0. 三家信用卡
const creditCard = ["visa", "master", "jcb"]

// 1. Zod 錯誤訊息 - interface接口
interface Zod_Response_Interface {
  success: boolean,
  nameError: string,
  cardnumberError: string,
  expireddateError: string,
  cvvError: string
}

export default function CreditCard() {
  // 1. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "Checkout"

  // 2. 各家信用卡 number, 對照 信用卡陣列之索引值, 以便高亮 
  const [card_Index, set_Card_Index] = useState(0);

  // 3. Redux - 指定飯店數據
  const redux_The_Hotel = useSelector((state: RootState) => state.hotel_Detail);
  const { makeAuthenticatedRequest } = useApiRequest();

  const router = useRouter()

  // 2. 透過 useFormState 套用 Server Actino函式 以及 zod錯誤訊息
  // const [state, formAction] = useFormState(Pay, initialState)

  // 3. 信用卡卡號
  const [cardNumber, set_CardNumber] = useState("")
  const handle_CardNumber_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '') // 拿掉非數字之字串
    // 2.1 每4個數字, 插入1個空格
    value = value.match(/.{1,4}/g)?.join(' ') || '';
    set_CardNumber(value);
  };

  // 3. 到期日
  const [expired_Date, set_Expired_Date] = useState("");
  const handle_ExpiredDate_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    set_Expired_Date(value)
  };

  // 4. CVV欄位
  const [cvv, set_Cvv] = useState("");
  const handle_Cvv_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if(value.length >4) {value = value.slice(0,3)}; // 只接受3碼 CVV
    set_Cvv(value)
  };
  
  // 5. 拿取 Redux 預定房型之數據
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  const redux_Form_Search = useSelector((state: RootState) => state.formSearch);

  // 6. 拿取 Redux 指定飯店 Tax 數據
  const redux_Hotel_Tax = useSelector((state: RootState) => state.hotel_Detail.tax);

  // 7. loading 樣式開關
  const [is_Loading, set_Is_Loading] = useState<boolean>(false);

  // 8. zod 校驗規則
  const schema = z.object({
    name: z.string().min(4, {message: "Must be 4 or more characters"})
            .max(20, {message: "Must be 20 or fewer characters"})
            .regex(/^[a-z]+$/i, {message: "Must be Alphabet"}), // 只能輸入字母
    cardnumber: z.string().min(19, {message: "Must be 16 characters"})
            .max(19, {message: "Must be 16 characters"}),
    expireddate: z.string().min(5, {message: "Must be 5 characters"})
            .max(5, {message: "Must be 5 characters"}),
    cvv: z.string().min(3, {message: "Must be 3 characters"})
            .max(3, {message: "Must be 3 characters"})
            .regex(/^\d+$/, { message: "CVV must contain only digits" })
  })

  // 9. zod 校驗, 並更新錯誤訊息
  const [zod_Response, set_Zod_Response] = useState<Zod_Response_Interface>()

  // 10. 付款
  const pay = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event?.preventDefault();
      const formData = new FormData(event.currentTarget);
      // 將 fomrData 轉成 物件, 一次性拿 所有 <input> 的 value 跟 name
      const formValue = Object.fromEntries(formData.entries());
      console.log(formValue, "所有<input>的 name 與 value");
  
      const validateFields = schema.safeParse(formValue);
  
      // 10.1 若驗證失敗, 篩選出個別錯誤訊息
      if(!validateFields.success) {
        const {fieldErrors} = validateFields.error.flatten();
        return set_Zod_Response({
          // ...prevState,
          success: false,
          nameError: fieldErrors.name?.[0] || "",
          cardnumberError: fieldErrors.cardnumber?.[0] || "",
          expireddateError: fieldErrors.expireddate?.[0] || "",
          cvvError: fieldErrors.cvv?.[0] || "",
        })
      } else {
        // 10.2 暫時校驗成功, 返回首頁
        set_Is_Loading(true);

        // 10.3 建立新訂單 API
        const booking_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/bookings";
        const response = await makeAuthenticatedRequest(booking_Url, {
          method: "POST",
          body: JSON.stringify({
            hotelId: redux_The_Hotel.hotel_Id,
            roomId: redux_Booked_Room.roomType_Id,
            travelerName: traveler_Name as string + traveler_Surname as string,
            customerEmail: traveler_Email,
            customerPhone: traveler_Phone,
            checkInDate: redux_Form_Search.start_Date,
            checkOutDate: redux_Form_Search.end_Date,
            adults: redux_Form_Search.adult,
            children: redux_Form_Search.child,
            roomCount: redux_Form_Search.room
          })
        });
        const data = await response.json();
        console.log(data, "查看訂單送出之API回應");

        await sleep(3000);
        toast.success("You will now be redirected to our secure payment gateway.", 
          {icon: '💳', duration: 6000, style:{display: 'flex', gap: '1rem'} }
        );
        // router.push("/") // 這邊應該是導向金流
        router.push("/bookingcompleted");
        // redirect("/")
      }
    } catch (error) {
      console.log(error);
    } finally {
      set_Is_Loading(false)
    }

  }

  // 11. sessionStorage 拿名字、電子郵件
  const traveler_Name = sessionStorage.getItem("name");
  const traveler_Surname = sessionStorage.getItem("surname");
  const traveler_Email = sessionStorage.getItem("email") as string;
  const traveler_Country = sessionStorage.getItem("country") as string;
  const traveler_Phone = sessionStorage.getItem("phone") as string;

  // 12 匹配優惠代碼
  const offer = Offer_List_Json.find((item) => item.offer_Id === redux_The_Hotel.offer_Id);

  // 13. next-intl i18n-翻譯
  const t = useTranslations("CreditCard");

  // 14. 住幾晚
  const nights = how_Many_Nights(redux_Form_Search.start_Date as string, redux_Form_Search.end_Date as string);

  return <div>
    {/** 回上一頁 */}
    <div className="lg:hidden">
      <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
    </div>
    {/** 回上一頁 */}
    
    <div className="customized-bg-gradient py-4 lg:hidden">
      <Payment_Progress_Bar></Payment_Progress_Bar>
    </div>

    {/** 選信用卡 */}
    <Credit_Card_List></Credit_Card_List>
    {/** 選信用卡 */}

    {/** <form>刷信用卡表單 */}
    <Form_Credit_Card></Form_Credit_Card>
    {/** <form>刷信用卡表單 */}
    

    {/** PC桌機 - 信用卡表單 */}
    <div className="hidden lg:flex flex-col p-4 pt-16">
      <div className="flex gap-2">

        {/** 左邊 1/2 */}
        <div className="flex basis-1/2 flex-col  gap-4">
          {/** 姓名、電子郵件 */}
          <div className="border border-softGray rounded flex flex-col gap-2 p-4">
            <p className="font-semibold">{t ("Your Detail Information")}</p>
            <div className="border-b border-softGray"></div>
            <div className="flex gap-2">
              <p className="font-semibold text-sm">{t ("Name")}: </p>
              <p className="text-sm">{traveler_Name + " " + traveler_Surname}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-semibold text-sm">{t ("Confirmation Mail To")}: </p>
              <p className="text-sm">{traveler_Email}</p>
            </div>
          </div>
          {/** 姓名、電子郵件 */}

          {/** 取消政策 */}
          <div className="flex flex-col border border-softGray rounded gap-2 p-4">
            <p className="font-semibold">{t ("Cancellation Policy")}</p>
            <div className="border-b border-softGray"></div>
            <ul className="flex flex-col gap-2">
              {redux_The_Hotel.cancellation_Policy?.split(".").map((cancel, index) => {
                return index < 6 && <li key={index} className="flex items-center gap-2">
                  <OtherSVG name="policy" className="w-4 h-auto"></OtherSVG>
                  <p>{cancel}</p>
                </li>
              })}
            </ul>
          </div>
          {/** 取消政策 */}
          

        {/** 信用卡<form>表單 */}
        <Toaster></Toaster>
        <form onSubmit={(event) => pay(event)} className="flex flex-col gap-2 border border-softGray rounded p-4">

          {/** 信用卡付3選1 */}
            <p className="font-semibold">{t ("Select Payment Method")}</p>
            <div className="flex gap-4 items-center">
              {creditCard.map((item, index) => {
                return  <div 
                className={`border border-softGray rounded flex justify-center gap-2 p-2 cursor-pointer w-1/3
                  ${card_Index === index ? 'bg-primary' : 'bg-white'}`}
                  key={index} onClick={() => set_Card_Index(index)}>
                    
                  <OtherSVG name={item} className="w-5 h-auto"></OtherSVG>
                  <p className={`${card_Index === index ? 'text-white' : ''}`}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </p>
                </div>
              })}
            </div>
          {/** 信用卡付3選1 */}

          <p className="font-semibold">{t ("Payment")}</p>
          <div className="border-b border-softGray"></div>
          
        {/** 信用卡所有<input> */}
          <div className="bg-[#f3f3f3] flex flex-col gap-2 rounded-lg p-4">

            {/** 信用卡持有人姓名 */}
            <label htmlFor="name" className="text-sm font-semibold">{t ("Card Holder Name")}</label>
            <input type="text" id="name" name="name" className="border-b border-strokeGray p-1 rounded" placeholder="Your Name">
            </input>
            <p aria-live="polite" className="text-customRed">{zod_Response?.nameError}</p>
            {/** 信用卡持有人姓名 */}
            
            {/** 信用卡卡號 */}
            <label htmlFor="cardnumber" className="text-sm font-semibold">{t ("Card Number")}</label>
            <input type="text" id="cardnumber" name="cardnumber" value={cardNumber}
            className="border-b border-strokeGray p-1 rounded"
            onChange={handle_CardNumber_Change} maxLength={19} placeholder="0000 0000 0000 0000">
            </input>
            <p aria-live="polite" className="text-customRed">{zod_Response?.cardnumberError}</p>
            {/** 信用卡卡號 */}

            <div className="flex justify-between gap-2">
              {/** 到期日 */}
              <div className="w-1/2 flex flex-col gap-2">
                <label htmlFor="expireddate" className="text-sm font-semibold">{t ("Expired Date")}</label>
                <input type="text" id="expireddate" name="expireddate" className="border-b border-strokeGray p-1 rounded"
                onChange={handle_ExpiredDate_Change} maxLength={5} placeholder="MM/YY" value={expired_Date}>
                </input>
                <p aria-live="polite" className="text-customRed">{zod_Response?.expireddateError}</p>
              </div>
              {/** 到期日 */}
              
              {/** CVV */}
              <div className="w-1/2 flex flex-col gap-2">
                <label htmlFor="cvv" className="text-sm font-semibold">CVV</label>
                <input type="text" id="cvv" name="cvv" className="border-b border-strokeGray p-1 rounded"
                onChange={handle_Cvv_Change} maxLength={3} placeholder="000" value={cvv}>
                </input>
                <p aria-live="polite" className="text-customRed">{zod_Response?.cvvError}</p>
              </div>
              {/** CVV */}
            </div>
          </div>
        {/** 信用卡所有<input> */}


        {!is_Loading ? 
          <button type="submit" className="bg-primary text-white text-center font-semibold py-2 rounded">
            {t ("Proceed")}
          </button>
        :
          <button type="submit"
          className="flex justify-center items-center gap-2 bg-softGray text-white text-center font-semibold py-2 rounded" disabled>
          <OtherSVG name="spin" className="animate-spin w-5 h-auto"></OtherSVG>
          {t ("Processing")}...
          </button>
        }
        </form>
        {/** 信用卡<form>表單 */}
        </div>



        {/** 右邊 1/2 */}
          <div className="basis-1/2 flex flex-col gap-2 sticky h-fit top-[70px]">
            <div className="basis-1/3 flex flex-col gap-2">
              {/** 房型圖片、總平均評價 */}
              <div className="flex gap-2">
                <img className="w-1/3 object-cover rounded" src={redux_Booked_Room.roomType_Image_List[0].url} alt={redux_Booked_Room.roomType_Image_List[0].description}/>
                <div className="w-1/2 flex flex-col gap-2">
                  <p className="font-semibold text-sm">{redux_The_Hotel.hotel_Name}</p>
                  <StarRating ranking={redux_The_Hotel.totalRating as number}></StarRating>
                  <div className="flex gap-2">
                    <p className="bg-blue rounded text-white px-3 py-2">{redux_The_Hotel.totalRating}</p>
                    <div className="flex flex-col justify-between">
                      <p className="text-blue font-semibold">{(redux_The_Hotel.totalRating as number) <=3 ? t ('Terrible') : t ('Excellent')}</p>
                      <p className="text-gray text-sm">{redux_The_Hotel.review_List.length} {t ("Reviews")}</p>
                    </div>
                  </div>
                  <p className="text-xs">{redux_The_Hotel.address}</p>
                </div>
              </div>
              {/** 房型圖片、總平均評價 */}
              

              {/** 訂單明細: 入住日、退房日、住幾晚、住幾人 */}
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm">{t ("Order Detail")}</p>

                <div className="flex bg-[#f3f3f3] rounded gap-2 p-2">
                  <div className="basis-1/2 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <ProfileSVG name="login" className="w-4 h-auto"></ProfileSVG>
                      <p>{t ("Check In")}:</p>
                    </div>
                    <p>{redux_Form_Search.start_Date as string}</p>
                  </div>

                  <div className="border-r border-softGray"></div>

                  <div className="basis-1/2 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <ProfileSVG name="login" className="w-4 h-auto"></ProfileSVG>
                      <p>{t ("Check Out")}:</p>
                    </div>
                    <p>{redux_Form_Search.end_Date as string}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <OtherSVG name="night" className="w-4 h-auto"></OtherSVG>
                  <p>{t ("Length of Stay")}: {how_Many_Nights(redux_Form_Search.start_Date as string, redux_Form_Search.end_Date as string)} {t ("Nights")}</p>
                </div>
                <div className="flex gap-2">
                  <OtherSVG name="bed" className="w-4 h-auto"></OtherSVG>
                  <p>{t ("Number of Rooms")}: {redux_Form_Search.room} {t ("Rooms")}</p>
                </div>

                <div className="border-b-2 border-dashed border-softGray"></div>
              </div>
              {/** 訂單明細: 入住日、退房日、住幾晚、住幾人 */}



              <div className="flex flex-col bg-strokeGray rounded p-2">
                <div className="flex gap-2">
                  <img className="rounded w-1/3" src={redux_The_Hotel.hotel_Image_List[0].url} alt={redux_The_Hotel.hotel_Image_List[0].description} />
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">{redux_Booked_Room.room_Type.slice(0,1).toUpperCase() + redux_Booked_Room.room_Type.slice(1)}</p>
                    <div className="flex gap-2">
                      {redux_Booked_Room.smoke === true ? <>
                        <OtherSVG name="smoking" className="w-4 h-auto"></OtherSVG>
                        <p>{t ("Smoking")}</p>
                      </>
                      : <>
                          <OtherSVG name="nosmoking" className="w-4 h-auto"></OtherSVG>
                          <p>{t ("No-Smoking")}</p>
                      </>
                      }
                    </div>
                    <div className="flex gap-2">
                      <OtherSVG name="roomsize" className="w-4 h-auto"></OtherSVG>
                      <p className="text-sm text-gray">{redux_Booked_Room.room_Size} {t ("m²")}</p>
                    </div>
                    <p className="text-sm text-gray">{t ("Max People")}: {redux_Booked_Room.max_People} {t ("Adults")}</p>
                    <div className="flex gap-2">
                      <p>{redux_Form_Search.adult} {t ("Adults")}</p>
                      {redux_Form_Search.child >0 && <p>{redux_Form_Search.child} {t ("Childs")}</p>}
                    </div>
                  </div>
                </div>
              </div>
            
            </div>


            {/* 所有金額統計 */}
            <div className="bg-[#f3f3f3] flex flex-col gap-2 rounded p-4">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">{t ("Room Price")}</p>
                {/** 房間價格 */}
                <p className="font-bold">$ {redux_Booked_Room.room_Price as number * nights}</p>
                {/** 房間價格 */}
              </div>
              
              <div className="flex justify-between">
                <p className="text-sm font-semibold">{t ("Tax")}</p>
                <p className="font-bold">{"+" + Math.round((redux_Hotel_Tax as number) * (redux_Booked_Room.room_Price ?? 0))}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">{t (offer?.offer_Name)} {t ("Offer")}</p>
                <p className="font-bold">{offer?.offer_Price as number * 100}% OFF</p>
              </div>
              <div className="border-b-2 border-dashed border-softGray"></div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">{t ("Total Amount")}</p>
                <p className="font-bold text-customRed">
                  {(Number(redux_Booked_Room.room_Price as number * nights) + (Math.round((redux_Hotel_Tax as number) * (redux_Booked_Room.room_Price ?? 0)))) * (1 - (offer?.offer_Price as number)) }
                </p>
              </div>
            </div>
            {/* 所有金額統計 */}
          </div>
        {/** 右邊 1/2 */}


      </div>



    </div>
    {/** PC桌機 - 信用卡表單 */}
  </div>
}