'use client';
import { useState } from "react";
// import { useFormState } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { Pay } from "@/actions/pay";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { sleep } from "@/utils/sleep";
import { OtherSVG } from "../client_Svg/client_Svg";
import Offer_List_Json from "@/fakeData/offer_List.json";
import { useTranslations } from "next-intl";
import how_Many_Nights from "@/utils/how_Many_Nights";

// 0. Zod 錯誤訊息初始值
// const initialState = "";

// 1. Zod 錯誤訊息 - interface接口
interface Zod_Response_Interface {
  success: boolean,
  nameError: string,
  cardnumberError: string,
  expireddateError: string,
  cvvError: string
}


export default function Form_Credit_Card () {
  const router = useRouter();

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
      // console.log(formValue, "所有<input>的 name 與 value");
      // const {name, cardNumber, expireddate, cvv} = formValue
      // const name = formData.get("name");
      // const cardnumber = formData.get("cardnumber");
      // const expireddate = formData.get("expireddate");
      // const cvv = formData.get("cvv");
      // console.log(name, cardnumber, expireddate, cvv);
  
      const validateFields = schema.safeParse(
        // name, cardnumber, expireddate, cvv
        formValue);
  
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
        const response = await fetch(booking_Url, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          credentials: 'include',
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
        // console.log(data, "查看訂單送出之API回應");

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

  // 11. 匹配優惠代碼
  const redux_The_Hotel = useSelector((state: RootState) => state.hotel_Detail);
  const offer = Offer_List_Json.find((item) => item.offer_Id === redux_The_Hotel.offer_Id);

  // 12. sessionStorage 拿名字、電子郵件
  const traveler_Name = sessionStorage.getItem("name");
  const traveler_Surname = sessionStorage.getItem("surname");
  const traveler_Email = sessionStorage.getItem("email") as string;
  const traveler_Country = sessionStorage.getItem("country") as string;
  const traveler_Phone = sessionStorage.getItem("phone") as string;

  // 13. next-intl i18n-翻譯
  const t = useTranslations("CreditCard")

  // 14. 住幾晚
  const nights = how_Many_Nights(redux_Form_Search.start_Date as string, redux_Form_Search.end_Date as string);



  return <div className="bg-primary rounded-t-3xl p-4 lg:hidden">
    <Toaster></Toaster>
    
    <form onSubmit={(event) => pay(event)} className="flex flex-col gap-6">
    {/** 信用卡所有<input> */}
      <div className="bg-white flex flex-col gap-2 rounded-lg p-4">

        {/** 信用卡持有人姓名 */}
        <label htmlFor="name" className="text-sm text-gray">{t ("Card Holder Name")}</label>
        <input type="text" id="name" name="name" className="border-b border-strokeGray p-1" placeholder="Your Name">
        </input>
        <p aria-live="polite" className="text-customRed">{zod_Response?.nameError}</p>
        {/** 信用卡持有人姓名 */}
        
        {/** 信用卡卡號 */}
        <label htmlFor="cardnumber" className="text-sm text-gray">{t ("Card Number")}</label>
        <input type="text" id="cardnumber" name="cardnumber" value={cardNumber}
        className="border-b border-strokeGray p-1"
        onChange={handle_CardNumber_Change} maxLength={19} placeholder="0000 0000 0000 0000">
        </input>
        <p aria-live="polite" className="text-customRed">{zod_Response?.cardnumberError}</p>
        {/** 信用卡卡號 */}

        <div className="flex justify-between gap-2">
          {/** 到期日 */}
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="expireddate" className="text-sm text-gray">{t ("Expired Date")}</label>
            <input type="text" id="expireddate" name="expireddate" className="border-b border-strokeGray p-1"
            onChange={handle_ExpiredDate_Change} maxLength={5} placeholder="MM/YY" value={expired_Date}>
            </input>
            <p aria-live="polite" className="text-customRed">{zod_Response?.expireddateError}</p>
          </div>
          {/** 到期日 */}
          
          {/** CVV */}
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="cvv" className="text-sm text-gray">CVV</label>
            <input type="text" id="cvv" name="cvv" className="border-b border-strokeGray p-1"
            onChange={handle_Cvv_Change} maxLength={3} placeholder="000" value={cvv}>
            </input>
            <p aria-live="polite" className="text-customRed">{zod_Response?.cvvError}</p>
          </div>
          {/** CVV */}
        </div>
      </div>
    {/** 信用卡所有<input> */}

    {/* 所有金額統計 */}
    <div className="bg-white flex flex-col gap-2 rounded-lg p-4">
      <div className="flex justify-between">
        <p className="text-sm text-gray">{t ("Room Price")}</p>
        {/** 房間價格 */}
        <p className="font-bold">$ {redux_Booked_Room.room_Price as number * nights}</p>
        {/** 房間價格 */}
      </div>
      
      <div className="flex justify-between">
        <p className="text-sm text-gray">{t ("Tax")}</p>
        <p className="font-bold">{"+" + Math.round((redux_Hotel_Tax as number) * (redux_Booked_Room.room_Price ?? 0))}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray">{t (offer?.offer_Name)} {t ("Offer")}</p>
        <p className="font-bold">{offer?.offer_Price as number * 100}% OFF</p>
      </div>
      <div className="border-b border-dashed border-[#D6E1EF]"></div>
      <div className="flex justify-between">
        <p className="text-sm text-gray">{t ("Total Amount")}</p>
        <p className="font-bold text-primary">
          {(Number(redux_Booked_Room.room_Price as number * nights) + (Math.round((redux_Hotel_Tax as number) * (redux_Booked_Room.room_Price ?? 0)))) * (1 - (offer?.offer_Price as number)) }
        </p>
      </div>
    </div>
    {/* 所有金額統計 */}


    {!is_Loading ? 
      <button type="submit" className="bg-secondary text-white text-center font-semibold py-2 rounded-lg">
        {t ("Proceed")}
      </button>
    :
      <button type="submit"
      className="flex justify-center items-center gap-2 bg-softGray text-white text-center font-semibold py-2 rounded-lg" disabled>
      <OtherSVG name="spin" className="animate-spin w-5 h-auto"></OtherSVG>
      {t ("Processing")}...
      </button>
    }

    </form>
  </div>
}