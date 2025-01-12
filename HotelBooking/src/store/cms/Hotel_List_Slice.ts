import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { add_Hotel_Detail_Interface, Hotel_List_Type } from "@/types/add_Hotel_Detail";

const initialState: Hotel_List_Type = []

const hotel_Detail_Slice = createSlice({
  name: "hotel_Detail",
  initialState,
  reducers: {
    // 1. 若已經有[{id:"1", hotel_Name:"Bangkok Hotel" ...}]，這個action，
    // 1.1 會在新增第2筆飯店時，把原有的第1筆整個覆蓋，造成Hotel_List只有1筆飯店，而非2筆
    update_Hotel_List: (state, action: PayloadAction<Hotel_List_Type>) => {
      console.log(state, "看一下State");
      console.log(action.payload, "看一下Action.payload");
      return action.payload
    },

    // 2.  這樣才是「新增1筆 飯店-物件」,丟到 Hotel_List 陣列裡面, state這邊是指 初始值的空陣列
    // 2.2 再透過展開運算子, 把第1筆的飯店保留, 外層上[], 後面再補第2筆 飯店-物件, 
    // 2.3 因此Hotel_List 就有2筆飯店
    add_One_Hotel: (state, action: PayloadAction<add_Hotel_Detail_Interface>) => {
      console.log(action.payload, "看一下Action.payload");
      return [...state, action.payload]
    }
  }
});

export const { add_One_Hotel } = hotel_Detail_Slice.actions;
export default hotel_Detail_Slice.reducer;