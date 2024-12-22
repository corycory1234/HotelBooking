'use client';
import { useState, useEffect } from "react"; 
import Datepicker from "react-tailwindcss-datepicker";
// 1. 從 "react-tailwindcss-datepicker" 拉出 { DateValueType }, 做為 TS型別, 以免跳警告 
import type { DateValueType } from "react-tailwindcss-datepicker";

// 2. startDate - 高亮「今天」
const START_FROM = new Date();
START_FROM.setMonth(START_FROM.getMonth());

// 3. 最小日 -「今天」
const MIN_DATE = new Date();
MIN_DATE.setDate(MIN_DATE.getDate());

// 4. 最大日 - 只能在「一年」內選日期
const MAX_DATE = new Date();
MAX_DATE.setFullYear(MAX_DATE.getFullYear() +1);

export default function DateRangePicker () { 
    const [value, setValue] = useState<DateValueType>({ 
        startDate: null, 
        endDate: null
    });

    const selectDate = (newValue: DateValueType) => {
      return setValue(newValue)
    }

    useEffect(() => {
      console.log(value);
    },[selectDate])

    

    return (
      // 1. 原始寫法
      // <Datepicker 
      //     value={value} 
      //     onChange={(newValue: DateValueType) => setValue(newValue)}
      // />

      // 2. 自己改良, 為了看 DateRange 回傳之格式
      // 3. i18n={navigator.language}：吃瀏覽器動態語言
      <Datepicker
        i18n={navigator.language}
        primaryColor={"teal"}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        popoverDirection="down"
        toggleClassName="absolute bg-primary rounded-r-lg text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        inputId="datepicker"
        inputName="datepicker"
        required={true}
        readOnly={true}
        startFrom={START_FROM}
        separator="to" 
        value={value} 
        onChange={(newValue: DateValueType) => selectDate(newValue)}
      /> 
    );
};
