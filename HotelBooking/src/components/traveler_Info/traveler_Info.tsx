// 這 client 是為了 <Previous_Page>子元件有用 useRouter, 父願見一定要用 'use client'
'use client'; 
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Swiper_Hotel_Detail from "@/components/swiper_Hotel_Detail/swiper_Hotel_Detail";
import Previous_Page from "./previous_Page";
import Room_Info from "./room_Info";
import Server_Form_Traveler_Info from "@/components/traveler_Info/server_Form_Traveler_Info";
import { set, z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sleep } from "@/utils/sleep";
import { OtherSVG, ProfileSVG } from "../client_Svg/client_Svg";
import toast, {Toaster} from "react-hot-toast";
import StarRating from "../starrating/star-Rating";
import how_Many_Nights from "@/utils/how_Many_Nights";
import Payment_Progress_Bar from "../payment_Progress_Bar/payment_Progress_Bar";
import { useTranslations } from "next-intl";


interface Zod_Response_Interface {
  success: boolean,
  nameError: string,
  surnameError: string,
  emailError: string,
  phoneError: string,
}


export default function Traveler_Info () {

  // 5. Redux - 被預訂飯店之之數據
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);
  const redux_The_Hotel = useSelector((state: RootState) => state.hotel_Detail);
  const redux_Form_Search = useSelector((state: RootState) => state.formSearch)
  // console.log(redux_Booked_Room, "Redux - 被預訂之房型");

  const router = useRouter();

  // 1. Redux - 查看是否登入
  const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);
  const redux_Traveler_Name = useSelector((state: RootState) => state.traveler_Info.name);
  const redux_Access_Token = useSelector((state: RootState) => state.access_Token.data.tokens.access_token);

  // 2. zod 校驗規則
  const schema = z.object({
    name: z.string().min(1, {message: "Must be 1 or more characters"})
                    .max(20, {message: "Must be 20 or fewer characters"}),
    surname: z.string().min(1, {message: "Must be 1 or more characters"})
                      .max(20, {message: "Must be 20 or fewer characters "}),
    email: z.string().email("Invalid Email"),
    phone: z.string().min(10, {message: "Must be 10 or more"})
                    .max(20, {message: "Must be 20 or fewer"})
                    .regex(/^\d+$/, { message: "Phone number must contain only digits" }) // 只能輸入數字
  });

  // 3. 透過 useFormState 套用 Server Actino函式 以及 zod錯誤訊息
  // const [state, formAction] = useFormState(Submit_Traveler_Info, initialState)

  // 4. zod 校驗, 並更新錯誤訊息
  const [zod_Response, set_Zod_Response] = useState<Zod_Response_Interface>()

  // 5. loading 樣式開關
  const [is_Loading, set_Is_Loading] = useState<boolean>(false);

  // 6. 拿取Redux - 預定房型之數據
  // const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room)
  const [name, set_Name] = useState<string>("");
  const [surname, set_Surname] = useState<string>("");
  const [email, set_Email] = useState<string>("");
  const [country, set_Country] = useState<string>("taiwan");
  const [phone, set_Phone] = useState<string>("");

  // 7. 旅客表單數據<form>, 存session Storage
  const handle_Change = ((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // console.log(event.target.id, event.target.value);
    if(event.target.id === "name") {
      set_Name(event.target.value);
      sessionStorage.setItem("name", event.target.value);
    } else if (event.target.id === "surname") {
      set_Surname(event.target.value);
      sessionStorage.setItem("surname", event.target.value);
    } else if(event.target.id === "email") {
      set_Email(event.target.value);
      sessionStorage.setItem("email", event.target.value);
    } else if(event.target.id === "country") {
      set_Country(event.target.value);
      sessionStorage.setItem("country", event.target.value);
    } else if(event.target.id === "phone") {
      set_Phone(event.target.value);
      sessionStorage.setItem("phone", event.target.value);
    }
  })

  // 8. 送出旅客<form>數據 
  const submit_Traveler_Info = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formValue = Object.fromEntries(formData.entries());
      // console.log(formValue, "看看formData一次全拉所有值");
      const validateFields = schema.safeParse(formValue);

      // 7.2 若驗證失敗, 篩選出個別錯誤訊息
      if(!validateFields.success) {
        const { fieldErrors } = validateFields.error.flatten();
        return set_Zod_Response({
          // ...prevState,
          success: false,
          nameError: fieldErrors.name?.[0] || "",
          surnameError: fieldErrors.surname?.[0] || "",
          emailError: fieldErrors.email?.[0] || "",
          phoneError: fieldErrors.phone?.[0] || "",
        })
      } 
      // 7.3  沒有 token, 就跳回'/auth', 但記得要給「當下頁面的搜尋參數」, 好讓登入後, 返回「旅客填寫表單」 
      else if (redux_Access_Token === '') {
        toast.error("Please Login First", {icon: "⚠️", duration: 2000})
        await sleep(2000);
        router.push(`/auth?redirect=${encodeURIComponent('/travelerinfo')}`);
      } 
      else {
        // 7.3 暫時校驗成功, 就跳轉 信用卡頁面
        // redirect("/creditcard");
        set_Is_Loading(true)
        await sleep(2000);
        router.push("/creditcard")
      }
    } catch (error) {
      console.log(error);
    } finally {
      set_Is_Loading(false);
    }
  };

  // 8. next-intl i18n-翻譯
  const t = useTranslations("TravelerInfo")

  
  return <>
  
  {/* 返回上頁按鈕 */}
  <Previous_Page></Previous_Page>
  {/* 返回上頁按鈕 */}

    {/** 外層背景 */}
    <div className="flex flex-col gap-3">
      <div className="lg:hidden pt-4">
        <Payment_Progress_Bar></Payment_Progress_Bar>
      </div>

      {/** Swiper 飯店圖片 */}
      <Swiper_Hotel_Detail redux_Booked_Room={redux_Booked_Room}></Swiper_Hotel_Detail>
      {/** Swiper 飯店圖片 */}
      

      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}
      <Room_Info></Room_Info>
      {/** 總平均評價、飯店名、飯店地址、入住退房、幾間房、幾晚、住幾人 */}


      {/** 付款<Form>表單 */}
      <Server_Form_Traveler_Info></Server_Form_Traveler_Info>
      {/** 付款<Form>表單 */}


      {/** PC桌機 */}
      <div className="hidden lg:flex flex-col p-4 pt-16">

        <div className="lg:flex justify-between gap-2">
          {/** 左邊 <form> 表單 */}
          <div className="basis-2/3 flex flex-col">

            <Toaster></Toaster>
            <form onSubmit={(event) => submit_Traveler_Info(event)} className="flex flex-col gap-4 p-4 border border-softGray rounded">
              <p className="font-semibold">{t ("Please Type Your Information")}</p>
              <div className="border-b border-softGray"></div>
              <div className="flex flex-col gap-4">

                <div className="flex justify-center items-center gap-2">
                  <label className="basis-1/2 flex flex-col text-gray">
                    {t ("Name")}
                    <input type="text" id="name" name="name" className="rounded border border-softGray p-1 text-black" 
                      value={name} onChange={(event) => handle_Change(event)}/>
                    <p aria-live="polite" className="text-customRed">{zod_Response?.nameError}</p>
                  </label>
                  <label className="basis-1/2 flex flex-col text-gray">
                    {t ("Surname")}
                    <input type="text" id="surname" name="surname" className="rounded border border-softGray p-1 text-black"
                      value={surname} onChange={(event) => handle_Change(event)}/>
                    <p aria-live="polite" className="text-customRed">{zod_Response?.surnameError}</p>
                  </label>
                </div>

                <div className="flex justify-center items-center gap-2">
                    <label className="basis-1/2 flex flex-col text-gray">
                      {t ("Country")}
                      <select name="country" id="country" className="rounded border border-softGray py-1.5 px-1 h-[42px] text-black"
                        defaultValue={country} onChange={(event)=> handle_Change(event)}>
                        <option value="taiwan">Taiwan</option>
                        <option value="china">China</option>
                        <option value="united states">United States</option>
                      </select>
                    </label>
                    <label className="basis-1/2 flex flex-col text-gray">
                      {t ("Phone Number")}
                      <input type="text" id="phone" name="phone" className="rounded border border-softGray p-1 text-black"
                      value={phone} onChange={(event) => handle_Change(event)}/>
                      <p aria-live="polite" className="text-customRed">{zod_Response?.phoneError}</p>
                    </label>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <label className="basis-1/2 flex flex-col justify-center text-gray">
                    {t ("Email Address")}
                    <input type="text" id="email" name="email" className="rounded border border-softGray p-1 text-black"
                      value={email} onChange={(event) => handle_Change(event)}/>
                    <p aria-live="polite" className="text-customRed">{zod_Response?.emailError}</p>
                  </label>

                  <label className="basis-1/2 flex flex-col justify-center text-gray">
                    {t ("Offer Code")}
                    <input type="text" id="offer" name="offer" className="rounded border border-softGray p-1 text-black"/>
                    {/* <p aria-live="polite" className="text-customRed">{zod_Response?.emailError}</p> */}
                  </label>
                </div>
              </div>

              <div className="border-t border-softGray"></div>

              {/** 取消政策 */}
              <div className="flex flex-col">
                <p className="font-semibold">{t ("Cancellation Policy")}</p>
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

              <div className="border-b border-softGray"></div>

              {/** formAction 寫在<button>上*/}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between">
                  <p className="font-semibold">{t ("Tax")}</p>
                  <p className="font-semibold">$ {Math.round((redux_The_Hotel.tax as number) * (redux_Booked_Room.room_Price as number))}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">{t ("Room Price")}</p>
                  <p className="font-semibold">$ {redux_Booked_Room.room_Price as number * how_Many_Nights(redux_Form_Search.start_Date as string, redux_Form_Search.end_Date as string)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">{t ("Total Price")}</p>
                  <p className="font-semibold">$ {(Number(redux_Booked_Room.room_Price as number * how_Many_Nights(redux_Form_Search.start_Date as string, redux_Form_Search.end_Date as string)) as number + (Math.round((redux_The_Hotel.tax as number) * (redux_Booked_Room.room_Price as number)))) }
                  </p>
                </div>

                {!is_Loading ?
                  <button className="bg-primary text-white rounded py-2"> {t ("Proceed to Pay")}</button>
                :
                  <button className="flex justify-center items-center gap-2 bg-softGray text-white rounded py-2" disabled>
                    <OtherSVG name="spin" className="w-5 h-auto animate-spin"></OtherSVG>
                      {t ("Processing") + "..."}
                  </button>
                }

              </div>
              {/** formAction 寫在<button>上*/}

            </form>
          </div>
          {/** 左邊 <form> 表單 */}
          
          
          {/** 右邊訂房資訊 */}
          <div className="basis-1/3 flex flex-col gap-2 sticky h-fit top-[70px]">
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
                  <p className="font-semibold">{t (redux_Booked_Room.room_Type)}</p>
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
          {/** 右邊訂房資訊 */}




        </div>

      </div>















      {/** PC桌機 */}
  </div>
  {/** 外層背景 */}
  </>
}