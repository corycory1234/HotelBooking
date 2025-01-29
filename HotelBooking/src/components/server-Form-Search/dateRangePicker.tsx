'use client';
import { useState, useEffect } from "react"; 
import Datepicker from "react-tailwindcss-datepicker";
// 1. 從 "react-tailwindcss-datepicker" 拉出 { DateValueType }, 做為 TS型別, 以免跳警告 
import type { DateValueType } from "react-tailwindcss-datepicker";
import { useDispatch, useSelector } from "react-redux";
// import { updateDateRange } from "@/store/form-Search/formSearchSlice";
import { RootState, AppDispatch } from "../../store/store";
import { updateDateRange, update_Start_Date, update_End_Date } from "../../store/form-Search/formSearchSlice";

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
  // 1.
  const dispatch: AppDispatch = useDispatch();
  // 1.1 ?.：如果 state.formSearch 是 undefined，就不會繼續取 .dateRange。
  // 1.2 ?? { startDate: null, endDate: null }：如果前方結果是 undefined 或 null，就用我們自己定義的空物件當預設。
  // const dateRange = useSelector((state: RootState) => state.formSearch?.dateRange ?? {startDate: null, endDate: null});
  const storedDateRange = useSelector((state: RootState) => state.formSearch.dateRange)

  const [value, setValue] = useState<{startDate: Date | null, endDate: Date | null}>({
    startDate: null,
    endDate: null
  })

  const selectDate = (newValue: {startDate: Date | null, endDate: Date | null}) => {
    setValue(newValue);
    console.log(newValue, "手動點選後, 日歷之數據格式");
    const { startDate, endDate } = newValue;
    if(startDate && endDate) {
      // console.log(startDate, endDate, "看看日期");
      // const formattedStart = startDate.toISOString().split("T")[0];
      // const formattedEnd = endDate.toISOString().split("T")[0];
      // dispatch(updateDateRange(`${formattedStart} to ${formattedEnd}`));

      // toLocaleString()會是"2025/1/20 上午11:11:11", 再用split(" ")照著" 空白字串", 切出陣列 - 2個元素, 並取第0個
      const formatted_Start_Date = startDate.toLocaleString().split(" ")[0];
      const formatted_End_Date = endDate.toLocaleString().split(" ")[0];

      dispatch(updateDateRange(`${formatted_Start_Date} to ${formatted_End_Date}`))
      dispatch(update_Start_Date(formatted_Start_Date));
      dispatch(update_End_Date(formatted_End_Date));
    } else {
      dispatch(updateDateRange(null));
    }
  }

    // const [value, setValue] = useState<DateValueType>({ 
    //     startDate: null, 
    //     endDate: null
    // });

    // const selectDate = (newValue: DateValueType) => {
    //   return setValue(newValue)
    // }

    useEffect(() => {
      if(storedDateRange) {
        const [start, end] = storedDateRange.split("to");
        setValue({
          startDate: new Date(start),
          endDate: new Date(end)
        })
      }
      // console.log(value);
    },[ storedDateRange])

    // 測試入住日 退房日
    const start_Date = useSelector((state: RootState) => state.formSearch.start_Date);
    const end_Date = useSelector((state: RootState) => state.formSearch.end_Date);
    console.log(start_Date, end_Date, "測試中");

    return (
      // 1. 原始寫法
      // <Datepicker 
      //     value={value} 
      //     onChange={(newValue: DateValueType) => setValue(newValue)}
      // />

      // 2. 自己改良, 為了看 DateRange 回傳之格式
      // 3. i18n={navigator.language}
      <>
        <Datepicker
          i18n={navigator.language}
          primaryColor={"teal"}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          popoverDirection="down"
          containerClassName="w-full lg:w-[50%] lg:inline-block lg:flex"
          inputClassName="w-full py-2 outline-none lg:border lg:border-gray rounded px-4 lg:w-full lg:py-2 lg:pb-[15px]"
          toggleClassName="absolute bg-primary rounded-r text-white right-4 h-[52px] lg:h-[57px] px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed
          lg:relative lg:align-middle lg:py-3 lg:-left-1"
          inputId="datepicker"
          inputName="datepicker"
          required={true}
          readOnly={true}
          startFrom={START_FROM}
          separator="to" 
          value={value} 
          onChange={(newValue: any) => selectDate(newValue)}
        />

        {/* 隱藏的輸入框，用於表單提交 */}
                <input 
          type="hidden" 
          name="datepicker" 
          value={storedDateRange || ""} 
        />
      </>
    );
};
