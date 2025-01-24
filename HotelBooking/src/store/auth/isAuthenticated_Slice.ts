import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User_Interface {
  id: string,
  name: string,
  userType: string,
  createdAt: string,
  updatedAt: string,
  email: string,
};

interface Verify_Session_Interface {
  success: boolean,
  data: {user: User_Interface}
};

const initialState: Verify_Session_Interface = {
  success: false,
  data: {
    user: {
      id: "",
      name: "",
      userType: "",
      createdAt: "",
      updatedAt: "",
      email: "",
    }
  }
}

const auth_Slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    update_Verify_Session: (state, action: PayloadAction<Verify_Session_Interface>) => {
      return action.payload;
    }
  }

});

export const { update_Verify_Session } = auth_Slice.actions;
export default auth_Slice.reducer;
