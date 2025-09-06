'use client';
// import { useFormState } from "react-dom";
// import { Submit_Traveler_Info } from "@/actions/traveler_Info";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuthState } from "@/hooks/useAuthState";
import { useApiRequest } from "@/hooks/useApiRequest";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sleep } from "@/utils/sleep";
import { OtherSVG } from "../client_Svg/client_Svg";
import toast, {Toaster} from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Zod_Response_Interface {
  success: boolean,
  nameError: string,
  surnameError: string,
  emailError: string,
  phoneError: string,
}

// 1. Zod 錯誤訊息初始值
// const initialState = {message: ""};

export default function Server_Form_Traveler_Info() {
  const router = useRouter();

  // 1. 整合的認證狀態 (Cookie + Redux)
  const { isAuthenticated, accessToken } = useAuthState();
  const { requireAuth, makeAuthenticatedRequest } = useApiRequest();
  console.log('📝 TravelerInfo auth check:', { isAuthenticated, hasToken: !!accessToken });

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
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room);

  // 7. Redux - 指定飯店明細
  const redux_The_Hotel = useSelector((state: RootState) => state.hotel_Detail);

  // 8. 旅客資訊, sessionStorage 初始值
  const [name, set_Name] = useState<string>("");
  const [surname, set_Surname] = useState<string>("");
  const [email, set_Email] = useState<string>("");
  const [country, set_Country] = useState<string>("taiwan");
  const [phone, set_Phone] = useState<string>("");

  // 9. 旅客表單數據<form>, 存session Storage
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

  // 7. 送出旅客<form>數據 
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
      else if (!requireAuth()) {
        await sleep(2000);
        router.push(`/auth?redirect=${encodeURIComponent('/travelerinfo')}`);
        return;
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
  const t = useTranslations("TravelerInfo");


  return <>
  <Toaster></Toaster>
  <form onSubmit={(event) => submit_Traveler_Info(event)} className="flex flex-col gap-2 p-4 lg:hidden">
    <div className="flex flex-col mb-36">

    <label htmlFor="name" className="text-gray">{t ("Name")}</label>
    <input type="text" id="name" name="name" className="rounded-lg border-2 border-softGray p-2"
      value={name} onChange={(event) => handle_Change(event)}/>
    <p aria-live="polite" className="text-customRed">{zod_Response?.nameError}</p>

    <label htmlFor="surname" className="text-gray">{t ("Surname")}</label>
    <input type="text" id="surname" name="surname" className="rounded-lg border-2 border-softGray p-2"
      value={surname} onChange={(event) => handle_Change(event)}/>
    <p aria-live="polite" className="text-customRed">{zod_Response?.surnameError}</p>

    <label htmlFor="email" className="text-gray">{t ("Email Address")}</label>
    <input type="text" id="email" name="email" className="rounded-lg border-2 border-softGray p-2"
      value={email} onChange={(event) => handle_Change(event)}/>
    <p aria-live="polite" className="text-customRed">{zod_Response?.emailError}</p>

    <label htmlFor="country" className="text-gray">{t ("Country")}</label>
    <select name="country" id="country" className="rounded-lg border-2 border-softGray p-2"
      defaultValue={country} onChange={(event) => handle_Change(event)}>
      <option value="taiwan">Taiwan</option>
      <option value="china">China</option>
      <option value="united states">United States</option>
    </select>
    

    <label htmlFor="phone" className="text-gray">{t ("Phone Number")}</label>
    <input type="text" id="phone" name="phone" className="rounded-lg border-2 border-softGray p-2"
      value={phone} onChange={(event) => handle_Change(event)}/>
    <p aria-live="polite" className="text-customRed">{zod_Response?.phoneError}</p>
    </div>

    {/** formAction 寫在<button>上*/}
    <div className="flex flex-col fixed bottom-0 right-0 p-4 customized-bg-gradient  w-full border-t border-softGray">
      <div className="flex justify-between">
        <p className="font-semibold">{t ("Tax")}</p>
        <p className="font-semibold">$ {Math.round((redux_The_Hotel.tax as number) * (redux_Booked_Room.room_Price as number))}</p>
      </div>
      <div className="flex justify-between">
        <p className="font-semibold">{t ("Room Price")}</p>
        <p className="font-semibold">$ {redux_Booked_Room.room_Price}</p>
      </div>
      <div className="flex justify-between">
        <p className="font-semibold">{t ("Total Price")}</p>
        <p className="font-semibold">
          $ {Math.round(Number(redux_Booked_Room.room_Price as number) + ((redux_The_Hotel.tax as number)) * (redux_Booked_Room?.room_Price as number))}
        </p>
      </div>

      {!is_Loading ?
        <button className="bg-primary text-white rounded-xl py-2"> {t ("Proceed to Pay")}</button>
      :
        <button className="flex justify-center items-center gap-2 bg-softGray text-white rounded-xl py-2" disabled>
          <OtherSVG name="spin" className="w-5 h-auto animate-spin"></OtherSVG>
            {t ("Processing")}...
        </button>
      }

    </div>
    {/** formAction 寫在<button>上*/}

  </form>
    
  </>
}