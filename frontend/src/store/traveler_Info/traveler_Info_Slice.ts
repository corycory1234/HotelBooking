import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Traveler_Info_Interface } from "@/types/traveler_Info";

// 1. 旅客填表單 - 初始值
const initialState: Traveler_Info_Interface = {
  name: '',
  surname: '',
  country: '',
  phone: '',
  email: '',
  offer_Id: '',
};

// 2. 旅客填表單 - Redux 設定
const traveler_Info_Slice = createSlice({
  name: "traveler_Info",
  initialState,
  reducers: {
    // 3. 更新旅客名
    update_Traveler_Name: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },

    // 4. 更新旅客姓
    update_Traveler_Surname: (state, action: PayloadAction<string>) => {
      state.surname = action.payload;
    },

    // 5. 更新旅客國家
    update_Country: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },

    // 6. 更新手機號碼
    update_Phone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },

    // 7. 更新郵件
    update_Email: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },

    // 8. 更新優惠券
    update_Offer_Id: (state, action: PayloadAction<string>) => {
      state.offer_Id = action.payload;
    }
  }
});

// 9. 輸出 Redux Action 函式
export const {
  update_Traveler_Name,
  update_Traveler_Surname,
  update_Country,
  update_Phone,
  update_Email,
  update_Offer_Id
} = traveler_Info_Slice.actions;

// 10. 輸出 Reducer, 給Store設定使用
export default traveler_Info_Slice.reducer;

