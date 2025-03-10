import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import hotel_List_Json from "@/fakeData/hotel_List.json";

interface Hotel_List_Interface {
  hotel_List: add_Hotel_Detail_Interface[]
};

const initialState: Hotel_List_Interface = {
  hotel_List: []
};

const hotel_List_Slice = createSlice({
  name: "hotel_List",
  initialState,
  reducers: {
    // 1. 空陣列 > 更新 JSON 假飯店列表 之 陣列
    update_Hotel_List: (state, action: PayloadAction<add_Hotel_Detail_Interface []>) => {
      state.hotel_List = action.payload
    },

    // 2. 空心 >> 實心愛心
    to_Full_Heart: (state, action: PayloadAction<add_Hotel_Detail_Interface>) => {
      const payload_Hotel = action.payload;
      state.hotel_List = state.hotel_List.map((item) => {
        if(item.hotel_Id === payload_Hotel.hotel_Id) {
          // 2.1 展開運算子, 拉出所有屬性, 再套上物件, 並且將 isCollected 更改成 true
          return {...item, isCollected: true}
        }
        return item
      })
    },

    // 3. 實心愛心 >> 空心
    to_Empty_Heart: (state, action: PayloadAction<add_Hotel_Detail_Interface>) => {
      const payload_Hotel = action.payload;
      state.hotel_List = state.hotel_List.map((item) => {
        if(item.hotel_Id === payload_Hotel.hotel_Id) {
          return {...item, isCollected: false}
        };
        return item;
      })
    }


  }
});

export const {update_Hotel_List, to_Full_Heart, to_Empty_Heart} = hotel_List_Slice.actions;
export default hotel_List_Slice.reducer;