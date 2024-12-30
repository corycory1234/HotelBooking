import { createTransform } from "redux-persist";
import type { DateValueType } from "react-tailwindcss-datepicker";

interface Form_Search {
  keyword: string;
  // dateRange: DateValueType;
  room: number,
  adult: number,
  child: number,
  rating: number | null
};

// 工具函式：解析數字
const parseNumberField = (value: unknown): number =>
  typeof value === "string" ? parseInt(value, 10) : (value as number);

// 工具函式：解析日期
const parseDateField = (date: string | null | undefined): Date | null =>
  date ? new Date(date) : null;

// 1.  假設我們只針對 formSearch slice 做日期轉換
// 1.1 createTransform<InboundState, OutboundState>, 
// 1.2 我們 存取 & 提出 的泛型是一致的, 所以 <Form_Search, Form_Search> 倆個都要寫
const formSearch_Transform = createTransform<Form_Search, Form_Search> (
  // inboundState：存進 localStorage 前呼叫
  (inboundState, key) => {
     // 這裡可以視需要做轉換，也可以直接回傳
    return inboundState
  },

  // 2. outboundState：重新載入(rehydrate)時呼叫
  (outboundState, key) => {
    if(!outboundState) return outboundState

    return {
      ...outboundState,
      // room: typeof outboundState.room === "string" ? parseInt(outboundState.room, 10) : outboundState.room,
      // adult: typeof outboundState.adult === "string" ? parseInt(outboundState.adult, 10) : outboundState.adult,
      // child: typeof outboundState.child === "string" ? parseInt(outboundState.child, 10) : outboundState.child,
      room: parseNumberField(outboundState.room),
      adult: parseNumberField(outboundState.adult),
      child: parseNumberField(outboundState.child),
      rating: parseNumberField(outboundState.rating)
    };
  },

   // 3.設定 whitelist => 只對 formSearch 這個 slice 生效
  { whitelist: ["formSearch"] }
);

export default formSearch_Transform;