import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel_Detail_Interface } from "@/types/hotel_Detail";
// import { create_Initial_HotelDetail } from "@/utils/factory";

// 1. Utils > 拿 factory.ts 當中的「飯店列表 & 巢狀飯店房型」初始值，拿來 Redux 中當 初始值
// 1.1 若直接把初始值寫再Redux，變成每個巢狀延伸出來的眾多屬性，都還要自己手寫一次
// 1.2 不如直接在 factory.ts 寫好一個巢狀就好，其他多的 [{item},{item}]，factory.ts 會自己辨識
// const initialState = create_Initial_HotelDetail();

const initialState: Hotel_Detail_Interface = {
  id: "",
  name: "",
  images: [],
  distance: "",
  rating: null,
  facilities: [],
  price: null,
  intro: [],
  reviews: [], // 初始為空陣列
  address: "",
  country: "",
  city: "",
  tax: 0,
  checkin: "",
  checkout: "",
  roomType: [], // 初始設為空陣列
  latitude: null,
  longtitude: null,
} 

const hotel_Detail_Slice = createSlice({
  name: 'hotel_Detail',
  initialState,
  reducers: {
    update_Hotel_Detail: (state, action: PayloadAction<Hotel_Detail_Interface>) => {
      return action.payload;
    }
  }
});

export const { update_Hotel_Detail } = hotel_Detail_Slice.actions;

export default hotel_Detail_Slice.reducer;