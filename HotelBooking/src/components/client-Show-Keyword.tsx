// 1. 僅在頂部秀「目的地 + 日期」
'use client';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import Server_Form_Search from "./server-Form-Search/server-Form-Search";
import Modal from "./modal/modal";

export default function Client_Show_Keyword () {
  const keyword = useSelector((state: RootState) => state.formSearch.keyword);
  const [formSearch, setFormSearch] = useState<boolean>(false);
  const show_FormSearch = () => {
    setFormSearch(!formSearch);
  }

  return <>
    <p onClick={show_FormSearch} className="text-center">{keyword} ･ OO月 XX日</p>

     {/* Modal */}
    <Modal isOpen={formSearch} onClose={() => setFormSearch(false)}>
        <h2 className="text-xl font-bold mb-4 p-6">Change Keyword</h2>
        <Server_Form_Search></Server_Form_Search>
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setFormSearch(false)}
        >
          關閉
        </button> */}
      </Modal>
  </>
}