'use client';

import { ProfileSVG } from "../client_Svg/client_Svg";
import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "../modal/modal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { OtherSVG } from "../client_Svg/client_Svg";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { update_Verify_Session } from "@/store/auth/isAuthenticated_Slice";
import { User_Data_Interface } from "@/types/user_Info";
import { z } from "zod";
import { zod_Email_Response_Interface } from "@/types/zod_Error_Response";
import Image from "next/image";
import { verify } from "crypto";

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
  useEffect(() => {
    console.log("uesEffect監聽多語系", language);
  },[language]);

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

  // 6. loading 布林值
  const [loading_Boolean, set_Loading_Boolean] = useState<boolean>(false);

  // 7. 登出
  const log_Out = async () => {
    try {
      set_Loading_Boolean(true); // loading動畫開始
      const log_Out_Url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/logout"
      const response = await fetch(log_Out_Url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data, "登出返回response");
      // 3.1 登出後, 給Redux初始值, 這邊寫很爛, 懶得想
      dispatch(update_Verify_Session({success: false,
        data: {
          user: {id: "",name: "",userType: "",createdAt: "",updatedAt: "",email: "",}
        }}));

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
      headers: {"Content-Type": "application/json",},
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

  


  return <div className="pb-20">
  
    <div className="bg-primary flex flex-col items-center gap-2 p-8">

      {/** 頭像更換 */}
      {redux_Verify_Session.success === false ? 
        <div className="rounded-full bg-softGray p-2"> 
          <ProfileSVG name={"user"} className="w-10 h-auto"></ProfileSVG>
        </div>
      :
        <Image src={"/account/avatarlg.png"} alt="avatar" width={128} height={128} 
        className="w-24 h-24">
        </Image>
      }
      {/** 頭像更換 */}
      
      
      {redux_Verify_Session.success === false ? <>
        {/** 登入 */}
        <p className="text-white">Sign in to see deals and manage your trip</p>
        <Link href={"/auth"}>
          <button type="button" className="bg-green-700 text-white rounded p-2">Sing In</button>
        </Link>
        {/** 登入 */}
      </>
      :
      <>
       {/** 登出 */}
      <div className="flex flex-col gap-2">
        <p className="text-white">Welcome</p>
        <p className="text-white">{redux_Verify_Session.data.user.name}</p>
      </div>

      {loading_Boolean === false ? 
        <button type="button" className="bg-green-700 text-white rounded p-2"
          onClick={log_Out}>Log Out
        </button>
        : 
        <button type="button" className="bg-softGray flex justify-center items-center rounded-lg p-3 gap-2" disabled>
          <OtherSVG name={"spin"} className="animate-spin w-5 h-auto"></OtherSVG>
            Processing...
        </button>
      }
      {/** 登出 */}
      </>
    }
    </div>



  <div className="customized-bg-gradient flex flex-col gap-4 p-4">

    {/** 多國語系切換 */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfileSVG name={"language"} className="w-5 h-auto" ></ProfileSVG>
        <p>Languages</p>
      </div>
      <select name="language" id="language" value={language} className="border rounded px-1 py-1" 
        onChange={(event) => switch_Language(event.target.value)}>
        <option value="zh-TW">繁體中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
    {/** 多國語系切換 */}

    <div className="border-b-2 border-softGray"></div>
    
    {/** 個人資料 */}
      <div className="flex justify-between cursor-pointer" 
        onClick={() => redux_Verify_Session.success === true ? open_User_Info_Modal() : please_Login()}>
        <div className="flex gap-2">
          <ProfileSVG name={"user"} className="w-5 h-auto"></ProfileSVG>
          <p>Personal Details</p>
        </div>
        <p>{">"}</p>
      </div>

      <Modal isOpen={modal_Boolean} onClose={() => set_Modal_Boolean(false)}>
        <div className="flex flex-col gap-2 p-4 max-h-[90vh]">
          <h2 className="text-xl font-semibold">Personal Info</h2>
        {
        !user_Info ? 
        <div className="flex justify-center items-center py-52">
          <OtherSVG name="spin" className="w-20 h-auto animate-spin"></OtherSVG>
        </div>

        :
          <form className="flex flex-col gap-2" onSubmit={submit}>
            <label className="flex flex-col gap-1">Name
              <input type="text" className="border rounded p-2" name="name" id="name"
              value={user_Info?.name} onChange={(event) => handle_Change(event)}/>
            </label>
            <label className="flex flex-col gap-1">Email
              <input type="text" className="border rounded p-2" name="email" id="email"
              value={user_Info?.email} onChange={(event) => handle_Change(event)}/>
            </label>
            <p aria-live="polite" className="text-lg text-customRed">{zod_Response?.emailError}</p>
            <button type="submit" className="mt-auto bg-primary p-2 rounded"> Submit </button>
          </form>
        }
        </div>
      </Modal>
    {/** 個人資料 */}


    <div className="border-b-2 border-softGray"></div>


    {/** 我的最愛  */}
    <Link href={"/mycollection"}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfileSVG name={"collection"} className="w-5 h-auto"></ProfileSVG>
          <p>My Collection</p>
        </div>
        <p>{">"}</p>
      </div>
    </Link>
    {/** 我的最愛  */}

    <div className="border-b-2 border-softGray"></div>

    {/** 我的評論  */}
      {redux_Verify_Session.success === false ? 
        <div className="flex justify-between cursor-pointer" onClick={please_Login}>
          <div className="flex gap-2">
            <ProfileSVG name={"review"} className="w-5 h-auto"></ProfileSVG>
            <p>My Reviews</p>
          </div>
          <p>{">"}</p>
        </div>
      :
        <Link href={"/myreview"} className="cursor-pointer">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <ProfileSVG name={"review"} className="w-5 h-auto"></ProfileSVG>
              <p>My Reviews</p>
            </div>
            <p>{">"}</p>
          </div>
        </Link>
      }
    {/** 我的評論  */}

    <div className="border-b-2 border-softGray"></div>

    {/** 訂閱電子報  */}
    <div className="flex justify-between cursor-pointer" onClick={() => set_modal_Subscription(true)}>
      <div className="flex gap-2">
        <ProfileSVG name={"subscribe"} className="w-5 h-auto"></ProfileSVG>
        <p>Subscribe</p>
      </div>
      <p>{">"}</p>
    </div>
    <Modal isOpen={modal_Subscription} onClose={() => set_modal_Subscription(false)}>
      <div className="flex flex-col gap-2 p-4">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <div className="flex flex-col gap-2 p-4 border border-softGray rounded">
            <div className="flex justify-between">
              <p>Latest News</p>
              <label className="relative inline-block w-10 h-6">
                <input type="checkbox" className="opacity-0 w-0 h-0"
                checked={switch_Boolean}
                onChange={(event) => subscribe(event.target.checked)}/>
                <span className={`absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition duration-300 bg-gray ${switch_Boolean === false ? 'bg-gray' : 'bg-green-50'}`}></span>
                <span className={`${switch_Boolean === true && 'bg-primary absolute left-1 top-1 w-4 h-4  rounded-full transition-transform duration-300'}`}></span>
                <span className={`${switch_Boolean === false && 'bg-white absolute right-1 top-1 w-4 h-4  rounded-full transition-transform duration-300'}`}></span>
              </label>
            </div>
            <p className="text-sm"> Receive specials from Our site</p>
          </div>
        </div>
    </Modal>
    {/** 訂閱電子報  */}



    <div className="border-b-2 border-softGray"></div>

    {/** 關於我們  */}
    <Link href={"/about"}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfileSVG name={"about"} className="w-5 h-auto"></ProfileSVG>
          <p>About Go Tour</p>
        </div>
        <p>{">"}</p>
      </div>
    </Link>
    {/** 關於我們  */}



  </div>
  
  </div>
}