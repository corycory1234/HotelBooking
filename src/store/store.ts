import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// 若需要 sessionStorage，改成 import storageSession from "redux-persist/lib/storage/session";
import numberReducer from "@/store/test/testSlice";
// import keywordReducer from "@/store/form-Search/formSearchSlice";
import formSearch_Reducer from "@/store/form-Search/formSearchSlice"
// 引入 transform, 把 date字串 轉 date物件格式, 不然無日曆法渲染, 造成報錯
import formSearch_Transform from "./transform/formSearchTransform";

// 1. 合併各 slice 的 reducer
const rootReducer = combineReducers({
  number: numberReducer,
  formSearch: formSearch_Reducer
})

// 2. 建立 persistConfig
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["formSearch"],
  // 你也可以只想持久化部分 slice，例如：whitelist: ["formSearch"] 或 blacklist: ["number"]
  // whitelist: ["formSearch"],
  transforms: [formSearch_Transform]
};

// 3. 用 persistReducer 包裝 rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. 建立 store，並將 persistedReducer 傳入
export const store  = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  // 4.1 原先不安裝 redux-persist 之寫法
  // reducer: {
  //   number: numberReducer,
  //   formSearch: keywordReducer,
  // }
});

// 5. 建立 persistor 供 <PersistGate> 使用
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;