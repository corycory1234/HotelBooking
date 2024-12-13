import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Number_Slice {
  value: number
};
const initialState: Number_Slice = {
  value: 0
};

const numberSlice = createSlice({
  name: 'number',
  initialState,
  reducers: {
    increase: (state) => { state.value +=1},
    decrease: (state) => { state.value -=1 },
    increaseByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const {increase, decrease, increaseByAmount} = numberSlice.actions;
export default numberSlice.reducer;