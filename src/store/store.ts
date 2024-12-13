import { configureStore } from "@reduxjs/toolkit";
import numberReducer from "@/store/test/testSlice";

export const store  = configureStore({
  reducer: {
    number: numberReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;