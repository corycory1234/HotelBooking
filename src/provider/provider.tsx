'use client';
// 1. Redux-Toolkit 於 客戶端設置
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

// 1. 用於更複雜的狀況
interface ProviderProps {
  children: React.ReactNode
}

export default function ProviderRedux ({ children }: ProviderProps) {

  return <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </>

}