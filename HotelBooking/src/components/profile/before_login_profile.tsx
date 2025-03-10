'use client';

import { ProfileSVG } from "../client_Svg/client_Svg";
import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "../modal/modal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { OtherSVG } from "../client_Svg/client_Svg";
import toast from "react-hot-toast";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { update_Verify_Session } from "@/store/auth/isAuthenticated_Slice";
import { update_Access_Token } from "@/store/access_Token/access_Token_Slice";
import { User_Data_Interface } from "@/types/user_Info";
import { z } from "zod";
import { zod_Email_Response_Interface } from "@/types/zod_Error_Response";
import Image from "next/image";
import {useLocale, useTranslations} from 'next-intl';
import { usePathname as i18n_usePathname, useRouter as i18n_useRouter } from "@/i18n/routing";


const language_List = ["zh-TW", "en-US"];

// 1. zod 校驗錯誤之訊息
const schema = z.object({email: z.string().email("Invalid Email"),})

export default function Before_Login_Profile () {
  // 0.
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // 1. 多國語系切換 - 如果是 zh-TW, 就吃zh-TW; 若不是, 一率吃en-US
  const [language, set_Language] = useState<string>(language_List.includes(navigator.language) ? navigator.language : "en-US")
  const switch_Language = (new_Language: string) => {
    set_Language(new_Language)
  };

  // 2. 個人資料 - Modal彈窗
  const [modal_Boolean, set_Modal_Boolean] = useState<boolean>(false);

  // 4. 訂閱電子報 - Modal彈窗
  const [modal_Subscription, set_modal_Subscription] = useState<boolean>(false);
  const [switch_Boolean, set_Switch_Boolean] = useState<boolean>(false);
  const subscribe = (value: any) => {
    set_Switch_Boolean(value)
  };

  // 5. Redux - 查看是否登入狀態
  const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);
  const redux_Access_Token = useSelector((state: RootState) => state.access_Token.data.tokens.access_token);
  const redux_User_Info = useSelector((state: RootState) => state.access_Token.data.user);

  // 6. loading 布林值
  const [loading_Boolean, set_Loading_Boolean] = useState<boolean>(false);

  // 7. 登出
  const log_Out = async () => {
    try {
      set_Loading_Boolean(true); // loading動畫開始
      const log_Out_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/logout"
      const response = await fetch(log_Out_Url, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `bearer ${redux_Access_Token}`},
        credentials: 'include'
      });
      const data = await response.json();

      // 3.1 登出後, 給Redux - Access_Token 初始值, 這邊寫很爛, 懶得想
      // dispatch(update_Verify_Session({success: false,
      //   data: {
      //     user: {id: "",name: "",userType: "",createdAt: "",updatedAt: "",email: "",}
      //   }}));
      dispatch(update_Access_Token({
        success: false,
        data: {
          user: {
            id: '',
            name: '',
            userType: '',
            email: ''
          },
          tokens: {
            access_token: '',
            refresh_token: ''
          }
        }
      }))

      if(!response.ok) {
        toast.error(data.message)
      }else {
        toast.success("Log Out Successfully");
        router.push("/")
      }

    } catch (error) {
      console.log(error, "錯誤");
    } finally {
      set_Loading_Boolean(false); // loading動畫開始
    }
  }

  // 8. 請先登入 - 沒token
  const please_Login = () => {
    toast("Please Login First", {icon: "⚠️"})
  }

  // 9. 取得個人明細
  const [user_Info, set_User_Info] = useState<User_Data_Interface>();
  const open_User_Info_Modal = () => {
    set_Modal_Boolean(true);
    get_User_Info()
  }
  const get_User_Info = async () => {
    const user_Info_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/me";
    const response = await fetch(user_Info_Url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        "Authorization":`bearer ${redux_Access_Token}`},
      credentials: 'include'
    })
    const {data} = await response.json();
    set_User_Info(data);
    set_Modal_Boolean(true);
  };

  // 10. Zod 錯誤訊息之 response
  const [zod_Response, set_Zod_Response] = useState<zod_Email_Response_Interface>();

  // 11. OnChange事件 - 改 email 跟 name
  const handle_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!user_Info) return;
    const {name, value} = event.target;
    set_User_Info({...user_Info, [name]: value});
  }

  // 12. 更新個人數據
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // 12.1 Zod 驗證
      const validateFields = schema.safeParse(user_Info);
        // 12.2 Zod 校驗之錯誤訊息
        if(!validateFields.success) {
          const { fieldErrors } = validateFields.error.flatten();
          return set_Zod_Response({ 
            success: false,
            emailError: fieldErrors.email?.[0] || "", // 只取第一個錯誤訊息
          })      
        };
        const formData = new FormData(event.currentTarget);
        const formValue = Object.fromEntries(formData.entries());
        // console.log(formValue);
        set_Modal_Boolean(false)
    } catch (error) {
      console.log(error);
    }
  };

  // 13. next-intl 切換語系
  const locale = useLocale();
  const [toggle_i18n, set_Toggle_i18n] = useState<boolean>(false);
  const i18n_PathName = i18n_usePathname();
  const next_PathName = usePathname();
  const i18n_Router = i18n_useRouter();
  const searchParams = useSearchParams();
  // 13.1 獲取當前查詢參數
  const currentParams = new URLSearchParams(searchParams.toString());
  // 13.2 i18n 切換語系
  const switch_i18n = (language: string) => {
    const new_Locale = language;
    // 5.2 建立全新URL路徑, 包含searchParams (不然中 -> 英, 會丟失hotellist「?所有搜尋參數」)
    const new_Path = `${i18n_PathName}?${currentParams.toString()}`;
    // 移除當前語言前綴（假設路徑格式為 /[lang]/path）
    const pathWithoutLocale = i18n_PathName.replace(/^\/[a-z-]+/, '') || '/';
    // 構建新路徑並保留參數
    // const new_Path = `${pathWithoutLocale}?${searchParams.toString()}`;
    i18n_Router.replace(new_Path, {locale: new_Locale});
    // router.replace(i18n_PathName, {locale: new_Locale});
  }

  // 14. next-intl i18n翻譯
  const t = useTranslations("Nav");

  


  return <div className="lg:pb-0">
  
    <div className="bg-primary flex flex-col items-center gap-2 p-8 lg:hidden">

      {/** 頭像更換 */}
      {redux_Access_Token === '' ? 
        <div className="rounded-full bg-softGray p-2"> 
          <ProfileSVG name={"user"} className="w-10 h-auto"></ProfileSVG>
        </div>
      :
        <Image src={"/account/avatarlg.png"} alt="avatar" width={128} height={128} 
        className="w-24 h-24">
        </Image>
      }
      {/** 頭像更換 */}
      
      
      {redux_Access_Token === '' ? <>
        {/** 登入 */}
        <p className="text-white">{t ("Sign in to see deals and manage your trip")}</p>
        <Link href={"/auth"}>
          <button type="button" className="bg-green-700 text-white rounded p-2">{t ("Login")}</button>
        </Link>
        {/** 登入 */}
      </>
      :
      <>
       {/** 登出 */}
      <div className="flex flex-col gap-2">
        <p className="text-white">{t ("Welcome")}</p>
        <p className="text-white">{redux_User_Info.name}</p>
      </div>

      {loading_Boolean === false ? 
        <button type="button" className="bg-green-700 text-white rounded p-2"
          onClick={log_Out}>{t ("Logout")}
        </button>
        : 
        <button type="button" className="bg-softGray flex justify-center items-center rounded-lg p-3 gap-2" disabled>
          <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            {t ("Processing")}...
        </button>
      }
      {/** 登出 */}
      </>
    }
    </div>



  <div className="customized-bg-gradient flex flex-col gap-4 p-4 min-h-[70vh] lg:min-h-[20vh] lg:p-2 lg:bg-none lg:gap-6">

    {/** 多國語系切換 */}
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <ProfileSVG name={"language"} className="w-5 h-auto" ></ProfileSVG>
        <p>{t ("Languages")}</p>
      </div>
      <select name="language" id="language" value={locale} className="border rounded px-1 py-1" 
        onChange={(event) => switch_i18n(event.target.value)}>
        <option value="zh-TW">{t ("zh-TW")}</option>
        <option value="en">{t ("en")}</option>
      </select>
    </div>
    {/** 多國語系切換 */}

    <div className="border-b-2 border-softGray lg:hidden"></div>
    
    {/** 個人資料 */}
      <div className="flex justify-between cursor-pointer" 
        onClick={() => redux_Access_Token !== '' ? open_User_Info_Modal() : please_Login()}>
        <div className="flex gap-2">
          <ProfileSVG name={"user"} className="w-5 h-auto"></ProfileSVG>
          <p>{t ("Personal Details")}</p>
        </div>
        <p className="lg:hidden">{">"}</p>
      </div>

      <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
        <div className="flex flex-col gap-2 p-4 max-h-[90vh]">
          <h2 className="text-xl font-semibold">{t ("Personal Info")}</h2>
        {
        !user_Info ? 
        <div className="flex justify-center items-center py-52">
          <OtherSVG name="spin" className="w-20 h-auto animate-spin"></OtherSVG>
        </div>

        :
          <form className="flex flex-col gap-2" onSubmit={submit}>
            <label className="flex flex-col gap-1">{t ("Name")}
              <input type="text" className="border rounded p-2" name="name" id="name"
              value={user_Info?.name} onChange={(event) => handle_Change(event)}/>
            </label>
            <label className="flex flex-col gap-1">{t ("Email")}
              <input type="text" className="border rounded p-2" name="email" id="email"
              value={user_Info?.email} onChange={(event) => handle_Change(event)}/>
            </label>
            <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.emailError}</p>
            <button type="submit" className="mt-auto bg-primary p-2 rounded"> {t ("Submit")} </button>
          </form>
        }
        </div>
      </Modal>
    {/** 個人資料 */}


    <div className="border-b-2 border-softGray lg:hidden"></div>

    {/** 我的訂單  */}
    {redux_Access_Token === '' ? 
      <div className="hidden lg:block" onClick={please_Login}>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <ProfileSVG name={"trip"} className="w-5 h-auto"></ProfileSVG>
            <p>{t ("My Trip")}</p>
          </div>
          <p className="lg:hidden">{">"}</p>
        </div>
      </div>
      :
      <Link href={"/trip"} className="hidden lg:block">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <ProfileSVG name={"trip"} className="w-5 h-auto"></ProfileSVG>
            <p>{t ("My Trip")}</p>
          </div>
          <p className="lg:hidden">{">"}</p>
        </div>
      </Link>
    }
    {/** 我的訂單  */}


    {/** 優惠券  */}
    {/* <Link href={"/offers"} className="hidden lg:block">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfileSVG name={"offer"} className="w-6 h-auto"></ProfileSVG>
          <p>Offers</p>
        </div>
        <p className="lg:hidden">{">"}</p>
      </div>
    </Link> */}
    {/** 優惠券  */}


    {/** 我的最愛  */}
    <Link href={"/mycollection"}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfileSVG name={"collection"} className="w-5 h-auto"></ProfileSVG>
          <p>{t ("My Collection")}</p>
        </div>
        <p className="lg:hidden">{">"}</p>
      </div>
    </Link>
    {/** 我的最愛  */}

    <div className="border-b-2 border-softGray lg:hidden"></div>

    {/** 我的評論  */}
      {redux_Access_Token === '' ? 
        <div className="flex justify-between cursor-pointer" onClick={please_Login}>
          <div className="flex gap-2">
            <ProfileSVG name={"review"} className="w-5 h-auto"></ProfileSVG>
            <p>{t ("My Reviews")}</p>
          </div>
          <p className="lg:hidden">{">"}</p>
        </div>
      :
        <Link href={"/myreview"} className="cursor-pointer">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <ProfileSVG name={"review"} className="w-5 h-auto"></ProfileSVG>
              <p>{t ("My Reviews")}</p>
            </div>
            <p className="lg:hidden">{">"}</p>
          </div>
        </Link>
      }
    {/** 我的評論  */}

    <div className="border-b-2 border-softGray lg:hidden"></div>

    {/** 訂閱電子報  */}
    <div className="flex justify-between cursor-pointer lg:hidden" onClick={() => set_modal_Subscription(true)}>
      <div className="flex gap-2">
        <ProfileSVG name={"subscribe"} className="w-5 h-auto"></ProfileSVG>
        <p>{t ("Subscribe")}</p>
      </div>
      <p className="lg:hidden">{">"}</p>
    </div>
    <Modal isOpen={modal_Subscription} onClose={() => set_modal_Subscription(false)}>
      <div className="flex flex-col gap-2 p-4 py-10">
          <h2 className="text-xl font-semibold">{t ("Subscription")}</h2>
          <div className="flex flex-col gap-2 p-4 border border-softGray rounded">
            <div className="flex justify-between">
              <p>{t ("Latest News")}</p>
              <label className="relative inline-block w-10 h-6">
                <input type="checkbox" className="opacity-0 w-0 h-0"
                checked={switch_Boolean}
                onChange={(event) => subscribe(event.target.checked)}/>
                <span className={`absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition duration-300 bg-gray ${switch_Boolean === false ? 'bg-gray' : 'bg-green-50'}`}></span>
                <span className={`${switch_Boolean === true && 'bg-primary absolute left-1 top-1 w-4 h-4  rounded-full transition-transform duration-300'}`}></span>
                <span className={`${switch_Boolean === false && 'bg-white absolute right-1 top-1 w-4 h-4  rounded-full transition-transform duration-300'}`}></span>
              </label>
            </div>
            <p className="text-sm"> {t ("Receive specials from Our site")}</p>

            <label>
              <p>{t ("Email")}</p>
              <input type="text" className="border rounded px-2" id="email" name="email"/>
            </label>
          </div>
        </div>
    </Modal>
    <div className="hidden lg:flex justify-between cursor-pointer" onClick={() => router.push("/subscribe")}>
      <div className="flex gap-2">
        <ProfileSVG name={"subscribe"} className="w-5 h-auto"></ProfileSVG>
        <p>{t ("Subscribe")}</p>
      </div>
      <p className="lg:hidden">{">"}</p>
    </div>
    {/** 訂閱電子報  */}



    <div className="border-b-2 border-softGray lg:hidden"></div>

    {/** 關於我們  */}
    <Link href={"/about"}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfileSVG name={"about"} className="w-5 h-auto"></ProfileSVG>
          <p>{t ("About Go Tour")}</p>
        </div>
        <p className="lg:hidden">{">"}</p>
      </div>
    </Link>
    {/** 關於我們  */}

  
    
    

  </div>


    <div className="hidden lg:block border-b border-softGray lg:pt-4"></div>
    
    {/** PC桌機 - 登入登出  */}
    <div className="hidden lg:block lg:pt-4 lg:px-2">
      {redux_Access_Token === '' ? 
        <Link href={"/auth"} >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <ProfileSVG name={"login"} className="w-5 h-auto"></ProfileSVG>
              <p>{t ("Login")}</p>
            </div>
            <p className="lg:hidden">{">"}</p>
          </div>
        </Link>
      :

        <div>
          <div className="flex gap-2" onClick={log_Out}>
            <ProfileSVG name={"logout"} className="w-5 h-auto"></ProfileSVG>
            <button >{t ("Logout")}</button>
          </div>
          <p className="lg:hidden">{">"}</p>
        </div>
      }
    </div>

    {/** PC桌機 - 登入登出  */}

  </div>
}