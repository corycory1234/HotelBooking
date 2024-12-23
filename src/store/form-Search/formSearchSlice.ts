import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { DateValueType } from "react-tailwindcss-datepicker";

interface Form_Search {
  keyword: string,
  // dateRange: DateValueType,
  room: number,
  adult: number,
  child: number
}

const initialState: Form_Search = {
  keyword: "",
  // dateRange: null,
  room: 1,
  adult: 1,
  child: 0
};

const formSearch_Slice = createSlice({
  name: 'formSearch',
  initialState,
  reducers: {
    updateKeyword: (state, action: PayloadAction<string>) => { 
      state.keyword = action.payload },
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
  }
});

export const { updateKeyword, addRoom, minusRoom, addAdult, minusAdult, addChild, minusChild } = formSearch_Slice.actions;
export default formSearch_Slice.reducer;