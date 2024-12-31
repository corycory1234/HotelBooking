import { createTransform } from "redux-persist";
import type { DateValueType } from "react-tailwindcss-datepicker";

interface Form_Search {
  keyword: string;
  // dateRange: DateValueType;
  room: number,
  adult: number,
  child: number,
  rating: number[] | null,
  bedType: string[] | null;
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

// 4.  假設我們只針對 formSearch slice 做日期轉換
// 4.1 createTransform<InboundState, OutboundState>, 
// 4.2 我們 存取 & 提出 的泛型是一致的, 所以 <Form_Search, Form_Search> 倆個都要寫
const formSearch_Transform = createTransform<Form_Search, Form_Search> (
  // 4.3 inboundState：存進 localStorage 前呼叫
  (inboundState, key) => {
     // 4.4 這裡可以視需要做轉換，也可以直接回傳
    return inboundState
  },

  // 4.5 outboundState：重新載入(rehydrate)時呼叫
  (outboundState, key) => {
    if(!outboundState) return outboundState

    return {
      ...outboundState,
      room: parseNumberField(outboundState.room),
      adult: parseNumberField(outboundState.adult),
      child: parseNumberField(outboundState.child),
      rating: parseNumberArray(outboundState.rating),
      bedType: parseStringArray(outboundState.bedType)
    };
  },

   // 4.5 設定 whitelist => 只對 formSearch 這個 slice 生效
  { whitelist: ["formSearch"] }
);

export default formSearch_Transform;