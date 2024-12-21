'use client';
// 1. Redux-Toolkit 於 客戶端設置
import { Provider } from "react-redux";
import { store } from "@/store/store";

// 1. 用於更複雜的狀況
interface ProviderProps {
  children: React.ReactNode
}

export default function ProviderRedux ({ children }: ProviderProps) {

  return <>
      <Provider store={store}>
        {children}
      </Provider>
    </>

}