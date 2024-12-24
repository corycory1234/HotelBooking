// 1. 僅在頂部秀「目的地 + 日期」
'use client';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Client_Show_Keyword () {
  const keyword = useSelector((state: RootState) => state.formSearch.keyword);
  
  return <>
    <p>{keyword} ･ OO月 XX日</p>
  </>
}