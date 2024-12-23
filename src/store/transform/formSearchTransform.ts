import { createTransform } from "redux-persist";
import type { DateValueType } from "react-tailwindcss-datepicker";

interface Form_Search {
  keyword: string;
  // dateRange: DateValueType;
  room: number,
  adult: number,
  child: number
}

// 1. 假設我們只針對 formSearch slice 做日期轉換

const formSearch_Transform = createTransform<Form_Search, Form_Search>(
  // inboundState：存進 localStorage 前呼叫
  (inboundState, key) => {
     // 這裡可以視需要做轉換，也可以直接回傳
    return inboundState
  },

  // outboundState：重新載入(rehydrate)時呼叫
  (outboundState, key) => {
    if(!outboundState) return outboundState

    return {
      ...outboundState,
      room: typeof outboundState.room === "string" ? parseInt(outboundState.room, 10) : outboundState.room,
      adult: typeof outboundState.adult === "string" ? parseInt(outboundState.adult, 10) : outboundState.adult,
      child: typeof outboundState.child === "string" ? parseInt(outboundState.child, 10) : outboundState.child,
    };


    // (A) 將 dateRange 的 startDate/endDate 從字串轉 Date
    // if(outboundState.dateRange) {
    //   const {startDate, endDate} = outboundState.dateRange;
    //   outboundState.dateRange = {
    //     startDate: startDate ? new Date(startDate) : null,
    //     endDate: endDate ? new Date(endDate) : null,
    //   };
    // }

    // (B) 將數字欄位 (room, adult, child) 從字串轉 number
    // 需要先判斷它是否是字串
    // if(typeof outboundState.room === "string") {
    //   outboundState.room = parseInt(outboundState.room, 10);
    // };
    // if(typeof outboundState.adult === "string") {
    //   outboundState.adult = parseInt(outboundState.adult, 10);
    // };
    // if(typeof outboundState.child === "string") {
    //   outboundState.child = parseInt(outboundState.child, 10);
    // }

    // return outboundState;
  },

   // 設定 whitelist => 只對 formSearch 這個 slice 生效
  { whitelist: ["formSearch"] }
);

export default formSearch_Transform;