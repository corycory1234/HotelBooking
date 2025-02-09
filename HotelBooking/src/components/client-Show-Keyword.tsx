// 1. 僅在頂部秀「目的地 + 日期」
'use client';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
// import Server_Form_Search from "./server-Form-Search/server-Form-Search";
import Index_Form_Search from "./form_Search/index_Form_Search";
import Modal from "./modal/modal";
import { useSearchParams } from "next/navigation";

export default function Client_Show_Keyword () {
  const keyword = useSelector((state: RootState) => state.formSearch.keyword);
  // 4. replace(/\d{4}-/g, "") - replace搭配正則，把"202X -"拿掉
  const dateRange = useSelector((state: RootState) => state.formSearch.dateRange)?.replace(/\d{4}-/g, "");
  
  const [formSearch, setFormSearch] = useState<boolean>(false);
  const show_FormSearch = () => {
    setFormSearch(!formSearch);
  };
  
  // 2. 監聽URL路徑
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  // const dateRange = searchParams.get("dateRange");
  const room = searchParams.get("room");
  const adult = searchParams.get("adult");
  const child = searchParams.get("child");
  const timestamp = searchParams.get("timestamp");

  // 3. URL參數一有變, 就關掉Modal
  useEffect(() => {
    setFormSearch(false)
  },[destination, room, adult, child, timestamp])

  return <>
    <div className="flex flex-col items-center text-white cursor-pointer" 
      onClick={show_FormSearch}>
      <p className="">{keyword} ･</p>
      <p>{dateRange}</p>
    </div>

    {/* Modal彈跳視窗 */}
      <Modal isOpen={formSearch} onClose={() => setFormSearch(false)}>
        <h2 className="text-xl font-bold mb-4 p-6">Change Keyword</h2>
        <Index_Form_Search></Index_Form_Search>
      </Modal>
    {/* Modal彈跳視窗 */}
  </>
}