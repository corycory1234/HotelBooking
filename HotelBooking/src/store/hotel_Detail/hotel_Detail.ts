import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel_Detail_Interface } from "@/types/hotel_Detail";

const initialState: Hotel_Detail_Interface = {
  id: "",
  name: "",
  images: [{url:"", description: ""}],
  distance: "",
  rating: 0,
  facilities: [],
  price: 0,
  intro: [],
  reviews: [
    {
      id: "",
      name: "",
      date: "",
      rating: 0,
      comment: ""
    }
  ]
};

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