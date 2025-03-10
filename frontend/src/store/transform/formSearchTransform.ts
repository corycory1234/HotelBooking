import { createTransform } from "redux-persist";
import type { DateValueType } from "react-tailwindcss-datepicker";
import { Form_Search_Interface } from "@/types/form_Search";

interface Form_Search {
  keyword: string;
  // dateRange: DateValueType;
  room: number,
  adult: number,
  child: number,
  rangeSlider: number | number[],
  rating: number[] | null,
  bedType: string[] | null;
  facility: string[] | null;
  start_Date: Date | null,
  end_Date: Date | null,
};

// 1. 工具函式：解析數字
const parseNumberField = (value: unknown): number =>
  typeof value === "string" ? parseInt(value, 10) : (value as number);

// 工具函式：解析日期
const parseDateField = (date: string | null | undefined): Date | null =>
  date ? new Date(date) : null;

// 2. 工具函式：解析床型 bedType, 用於安全地把儲存於 localStorage 的字串轉回 string[]
const parseStringArray = (value: unknown): string[] | null => {
  if(value === null) return null;
  // 2.1 若可能是字串就嘗試用 JSON.parse
  if(typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      return null
    }
  };
  // 2.2 若已經是陣列，就檢查它是不是 string[]，若不是的話可再自行過濾
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string") as string[]
  };
  return null
};

// 3. 工具函式：解析飯店星級 rating, 用於安全地把儲存於 localStorage 的字串轉回 number[]
const parseNumberArray = (value: unknown): number[] | null => {
  if(value === null) return null;
  // 3.1 若可能是字串就嘗試用 JSON.parse
  if(typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if(!Array.isArray(parsed)) return null;
      // 3.2 轉成 number[], 有些值可能是 string，要再 parseInt 一下
      return parsed.map((item) => Number(item)).filter((num)=> !isNaN(num))
    } catch (error) {
      return null;
    }
  };
  // 3.3 若已經是陣列，就檢查裡面是否都是 number 或可被轉成 number
  if (Array.isArray(value)) {
    return value.map((item) => Number(item)).filter((num) => !isNaN(num));
  };
  return null;
}

// 4.   格式化 - 日期, 為了要符合使用者所在當地, 所以才拆成getFullYear, getMonth, getDate, 
// 4.1 以對應使用者他人所在的時區
const format_Date = (date: Date) => {
  const year = date.getFullYear();
  // getMonth() 回傳 0 ~ 11，所以要加 1 並補零
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

// 4.  假設我們只針對 formSearch slice 做日期轉換
// 4.1 createTransform<InboundState, OutboundState>, 
// 4.2 我們 存取 & 提出 的泛型是一致的, 所以 <Form_Search, Form_Search> 倆個都要寫
const formSearch_Transform = createTransform(
  // 4.3 inboundState：存進 localStorage 前呼叫
  (inboundState: Form_Search_Interface, key) => {
     // 4.4 這裡可以視需要做轉換，也可以直接回傳
    return inboundState
  },

  // 4.5 outboundState：重新載入(rehydrate)時呼叫
  (outboundState: Form_Search_Interface, key) => {
    if(!outboundState) return outboundState
    // 4.6 宣告「今天」」
    const today = new Date();
    // 4.7 預設使用原本的日期，如果沒有更新就使用Redux - formSearch裡面的原始值
    let new_Start_Date: Date = outboundState.start_Date ? new Date(outboundState.start_Date.toString()) : today;
    // 4.8 預設使用原本的明天，如果沒有更新就使用Redux - formSearch裡面的原始值, 
    // 4.9 明天要多補上 getTime() 加 24 * 60 * 60 * 1000, 才算是「明天」
    let new_End_Date: Date = outboundState.end_Date ? new Date(outboundState.end_Date.toString()) : new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if(outboundState.start_Date) {
      // 4.10 存下 Redux - formSearch 的「今天」
      const stored_Start_Date = new Date(outboundState.start_Date.toString());
      // 4.11 如果  Redux - formSearch 的「今天」小於 真正的「今天」, 
      // 4.12 那麼, Redux的今天就轉成「真正的今天」
      if(stored_Start_Date < today) {
        new_Start_Date = today;
        if(outboundState.end_Date) {
          const stored_End_Date = new Date(outboundState.end_Date.toString());
        // 4.12 如果  Redux - formSearch 的「明天」小於 真正的「今天」, 
        // 4.12 那麼, Redux的「明天」就轉成「真正的明天」
          new_End_Date = stored_End_Date > today ? stored_End_Date : new Date(new_Start_Date.getTime() + 24 * 60 * 60 * 1000);
        } else {
          // 若沒 退房日, 預設就新 入住日 再加一天
          new_End_Date = new Date(new_Start_Date.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    }


    return {
      ...outboundState,
      room: parseNumberField(outboundState.room),
      adult: parseNumberField(outboundState.adult),
      child: parseNumberField(outboundState.child),
      rangeSlider: parseNumberField(outboundState.rangeSlider),
      rating: parseNumberArray(outboundState.rating),
      bedType: parseStringArray(outboundState.bedType),
      facility: parseStringArray(outboundState.facility),
      start_Date: format_Date(new_Start_Date as Date),
      end_Date: format_Date(new_End_Date as Date),
      dateRange: `${format_Date(new_Start_Date)} to ${format_Date(new_End_Date)}`
    };
  },

   // 4.5 設定 whitelist => 只對 formSearch 這個 slice 生效
  { whitelist: ["formSearch"] }
);

export default formSearch_Transform;