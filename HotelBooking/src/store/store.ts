import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import formSearch_Reducer from "./form-Search/formSearchSlice";
import hotel_Detail_Reducer from "./hotel_Detail/hotel_Detail";
import booked_Room_Reducer from "./booked_Room/booked_Room";
import hotel_List_Reducer from "@/store/cms/Hotel_List_Slice";
import auth_Reducer from "@/store/auth/isAuthenticated_Slice"
import my_Collection_Reducer from "@/store/my_Collection/my_Collection_Slice";
import hotel_List_Reducer2 from "@/store/hotel_List/hotel_List_Slice";
import traveler_Info_Reducer from "@/store/traveler_Info/traveler_Info_Slice";
import access_Token_Reducer from "@/store/access_Token/access_Token_Slice";


// 引入 transform, 把 date字串 轉 date物件格式, 不然無日曆法渲染, 造成報錯
import formSearch_Transform from "./transform/formSearchTransform";
// 先從 redux-persist/es/constants 或 redux-persist 中引入要忽略的 action 常數：
import {FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER,} from "redux-persist";

// 1. 合併各 slice 的 reducer
const rootReducer = combineReducers({
  formSearch: formSearch_Reducer,
  hotel_Detail: hotel_Detail_Reducer,
  booked_Room: booked_Room_Reducer,
  hotel_List: hotel_List_Reducer,
  verify_Session: auth_Reducer,
  my_Collection: my_Collection_Reducer,
  hotel_List2: hotel_List_Reducer2,
  traveler_Info: traveler_Info_Reducer,
  access_Token: access_Token_Reducer
})


// 2. 建立 persistConfig
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["formSearch", 
    "hotel_Detail", 
    "booked_Room", 
    "hotel_List", 
    "verify_Session", 
    "my_Collection", 
    "hotel_List2", 
    "traveler_Info",
    "access_Token"
  ],
  // 2.1 你也可以只想持久化部分 slice，例如：whitelist: ["formSearch"] 或 blacklist: ["number"]
  transforms: [formSearch_Transform]
};

// 3. 用 persistReducer 包裝 rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. 建立 store，並將 persistedReducer 傳入
export const store  = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  // 4.2 這樣就能避免在執行 persist/PERSIST 或 REGISTER 時出現非序列化值的警告。
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, "formSearch/updateDateRange"],
      },
    })
  // 4.1 原先不安裝 redux-persist 之寫法
  // reducer: {
  //   formSearch: keywordReducer,
  // }
});

// 5. 建立 persistor 供 <PersistGate> 使用
export const persistor = persistStore(store);

// 6. 定義 RootState 並包含 PersistPartial
export type RootState = ReturnType<typeof rootReducer>;
// export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;