import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Access_Token_Interface } from "@/types/access_Token";

// 1. 令牌 API - 初始值 (待後端寫好, 欄位可能變動)
const initialState: Access_Token_Interface = {
  success: false,
  data: {
    user: {
      id: '',
      name: '',
      userType: '',
      email: ''
    },
    tokens: {
      access_token: '',
      refresh_token: ''
    }
  }
};

const access_Token_Slice = createSlice({
  name: 'access_Token',
  initialState,
  reducers: {
    update_Access_Token: (state, action: PayloadAction<Access_Token_Interface>) => {
      return state = action.payload
    }
  }
});

export const { update_Access_Token } = access_Token_Slice.actions;
export default access_Token_Slice.reducer;