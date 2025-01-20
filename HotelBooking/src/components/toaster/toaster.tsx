'use client';
import { Toaster } from "react-hot-toast";

// 1. 吐司訊息 - 必須寫成 客戶端 
export default function Toaster_Notify () {
  return <Toaster position="top-center" reverseOrder={false}></Toaster>
}