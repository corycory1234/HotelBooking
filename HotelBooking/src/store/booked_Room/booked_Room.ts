import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel_Room_Type_Interface } from "@/types/hotel_Detail";

const initialState: Hotel_Room_Type_Interface = {
    id: "",
    roomType: "singleRoom", // 初始現吃單人房，狀態更新後，會被替代
    price: null,
    images: [],
    availability: 0,
    smoke: null,
    amenity: [],
    roomsize: null,
    maxOccupancy: null
};

const booked_Room_Slice = createSlice({
  name: "booked_Room",
  initialState,
  reducers: {
    update_Booked_Room: (state, action: PayloadAction<Hotel_Room_Type_Interface>) => {
      return action.payload;
    }
  }
});

export const { update_Booked_Room } = booked_Room_Slice.actions;
export default booked_Room_Slice.reducer;