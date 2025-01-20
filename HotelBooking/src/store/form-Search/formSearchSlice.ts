import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DateValueType } from "react-tailwindcss-datepicker";

interface Form_Search {
  keyword: string,
  dateRange: string | null,
  start_Date: Date | null | string,
  end_Date: Date | null | string,
  // dateRange: DateValueType,
  room: number,
  adult: number,
  child: number,
  rangeSlider: number | number[],
  bedType: string[] | null,
  rating: number[] | null,
  facility: string[] | null,
}

const initialState: Form_Search = {
  keyword: "",
  dateRange: null,
  start_Date:  null,
  end_Date:  null,
  room: 1,
  adult: 1,
  child: 0,
  rangeSlider: [0, 9999],
  bedType: [],
  rating: [],
  facility: [],
};

const formSearch_Slice = createSlice({
  name: 'formSearch',
  initialState,
  reducers: {
    updateKeyword: (state, action: PayloadAction<string>) => { 
      state.keyword = action.payload },
    updateDateRange: (state, action: PayloadAction<string | null>) => {
      state.dateRange = action.payload;
    },
    // updateDateRange: (state, action: PayloadAction<DateValueType>) => {
    //   state.dateRange = action.payload
    // },
    addRoom: (state) => { state.room +=1 },
    minusRoom: (state) => {
      if(state.room <=1) return;
      state.room -=1
    },
    addAdult: (state) => { state.adult +=1 },
    minusAdult: (state) => {
      if(state.adult <=1) return;
      state.adult -=1
    },
    addChild: (state) => { state.child +=1 },
    minusChild: (state) => {
      if(state.child <=0) return;
      state.child -=1
    },
    // Filter 星級
    updateRating: (state, action: PayloadAction<number[] | null>) => {
      state.rating = action.payload;
      console.log(state.rating, "Redux 飯店星級");
    },
    // Filter 床型
    updateBedType: (state, action: PayloadAction<string[] | null>) => {
      state.bedType = action.payload
      console.log(state.bedType, "Redux 房型");
    },
    // Filter 設施
    updateFacility: (state, action: PayloadAction<string[] | null>) => {
      state.facility = action.payload;
      console.log(state.facility, "Redux 設施");
    },
    // Filter RangeSlider 最小房價-最大房價
    updateRangeSlider: (state, action: PayloadAction<number | number[]>) => {
      state.rangeSlider = action.payload
      console.log(state.rangeSlider, "最小房價 - 最大房價");
    },

    // 更新 入住日
    update_Start_Date: (state, action: PayloadAction<Date | null | string>) => {
      state.start_Date = action.payload
      console.log("Redux的起始日", state.start_Date);
    },
    // 更新 退房日
    update_End_Date: (state, action: PayloadAction<Date | null | string>) => {
      state.end_Date = action.payload
      console.log("Redux的退房日", state.end_Date);
    }
  }
});

export const { updateKeyword, 
  addRoom, 
  minusRoom, 
  addAdult, 
  minusAdult, 
  addChild, 
  minusChild, 
  updateDateRange, 
  updateRating,
  updateBedType,
  updateFacility,
  updateRangeSlider,
  update_Start_Date,
  update_End_Date
} = formSearch_Slice.actions;
export default formSearch_Slice.reducer;