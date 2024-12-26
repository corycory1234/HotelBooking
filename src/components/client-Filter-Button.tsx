'use client';
import Modal from "./modal/modal";
import { useState } from "react";

export default function Client_Filter_Button () {
  const [filter_Boolean, setFilter_Boolean] = useState<boolean>(false);
  const show_Filter_Modal = () => {
    setFilter_Boolean(!filter_Boolean)
  }

  return <>
    {/* Filter 與 熱門搜尋條件 */}
    <div className="px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar scrollbar-hidden">
      <button  onClick={show_Filter_Modal} className="flex items-center py-1 px-2 bg-custom rounded text-sm bg-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded text-sm">5 Star</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded text-sm">Pool</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded text-sm">Spa</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded text-sm">Beach</button>
    </div>
    {/* Filter 與 熱門搜尋條件 */}

    {<Modal isOpen={filter_Boolean} onClose={() => setFilter_Boolean(false)}>
      <div>Filter彈窗</div>
    </Modal>}
  </>
}