import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel_Room_Type_Interface } from "@/types/hotel_Detail";
import { add_Hotel_Room_Type_Interface } from "@/types/add_Hotel_Detail";

const initialState: add_Hotel_Room_Type_Interface = {
    roomType_Id: "",
    room_Type: "singleRoom", // 初始現吃單人房，狀態更新後，會被替代
    room_Price: null,
    roomType_Image_List: [],
    room_Availability: 0,
    smoke: false,
    amenity_List: [],
    room_Size: null,
    max_People: null,
    view: "" ,
    bed_Type: "" 
};

const booked_Room_Slice = createSlice({
  name: "booked_Room",
  initialState,
  reducers: {
    update_Booked_Room: (state, action: PayloadAction<add_Hotel_Room_Type_Interface>) => {
      return action.payload;
    }
  }
});

export const { update_Booked_Room } = booked_Room_Slice.actions;
export default booked_Room_Slice.reducer;