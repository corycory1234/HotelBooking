'use client';
import Modal from "./modal/modal";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Submit_Search } from "@/actions";
import { useSearchParams } from "next/navigation";
import Client_RangeSlider from "./server-Form-Search/client_RangeSlider";
import Client_BedType from "./server-Form-Search/client_BedType";
import Client_Rating from "./server-Form-Search/client_Rating";
import Client_Faciliy from "./server-Form-Search/client_Facility";

export default function Client_Filter_Button () {

  // 1.  取 Redux「搜尋相關數據」
  const destination = useSelector((state: RootState) => state.formSearch.keyword);
  const storedDateRange = useSelector((state: RootState) => state.formSearch.dateRange);
  const room = useSelector((state: RootState) => state.formSearch.room);
  const adult = useSelector((state: RootState) => state.formSearch.adult);
  const child = useSelector((state: RootState) => state.formSearch.child);

  // 2. 需要 timeStamp 時間戳, 來偵測「Apply」當下幾毫秒, 若有變, 
  // 2. 就關掉Modal(關掉前會送出 Server Action - Submit_Search函式) 
  const searchParams = useSearchParams();
  const timestamp = searchParams.get("timestamp");
  
  // 3. Filter 彈跳Modal, 布林開關
  const [filter_Boolean, setFilter_Boolean] = useState<boolean>(false);
  const show_Filter_Modal = () => {
    setFilter_Boolean(!filter_Boolean)
  }

  // 4. 若 timeStamp時間戳有異動，布林轉false，關掉談 Filter 彈跳Modal
  useEffect(() => {
    setFilter_Boolean(false);
  },[timestamp])

  // 5. 初始化所有篩選條件 - 按下也會直接關Modal, 有BUG, 
  // 5.1 觸發到 Server Action, 但改成 tpye="button", 再F5, 篩選條件仍是上次的Redux狀態  
  const reset = () => {
    // set_Checked_Beds([]);
    // set_Checked_Rating([]);
    // set_Checked_Facility([]);
    // setValue([])
  }

 // 6. 送出<form>按鈕
  const handleSubmit = () => {
  if (formRef.current) {
    formRef.current.requestSubmit(); // 觸發表單的 onSubmit 事件
  }
};

  // 7. 取 <form>表單之 ref
  const formRef = useRef<HTMLFormElement>(null);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止默認的表單提交行為
    handleSubmit();      // 更新 Redux 狀態
  
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      Submit_Search(formData);
    }
  };



  return <>
    {/* Filter 與 熱門搜尋條件 */}
    <div className="px-4 py-2 flex items-center gap-3 overflow-x-auto scrollbar-hidden">
      <button  onClick={show_Filter_Modal} className="flex items-center py-1 px-2 bg-custom rounded text-sm bg-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">5 Star</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">Pool</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">Spa</button>
      <button className="whitespace-nowrap px-3 py-1.5 border border-gray rounded text-sm">Beach</button>
    </div>
    {/* Filter 與 熱門搜尋條件 */}


    {/** Filter 彈跳視窗 */}
    {<Modal isOpen={filter_Boolean} onClose={() => setFilter_Boolean(false)}>
      <title>Filter Modal</title>


      <form ref={formRef} onSubmit={handleFormSubmit} className="mx-auto flex flex-col">
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}
          <input type="hidden" name="destination" value={destination} />
          <input type="hidden" name="datepicker" value={storedDateRange || ""} />
          <input type="hidden" name="room" value={room} />
          <input type="hidden" name="adult" value={adult} />
          <input type="hidden" name="child" value={child} />
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}

        <div className="flex justify-between items-center p-4 border-b border-gray">
          <h2 className="text-lg font-semibold">Filter</h2>
        </div>

        <div className="flex flex-col overflow-y-auto px-4 py-2">
          
          {/** 最小最大旅館價格 - RangeSlider */}
          <div className="mb-6">        
            <h3 className="font-medium mb-3">Price Range</h3>
              <Client_RangeSlider></Client_RangeSlider>
          </div>
          {/** 最小最大旅館價格 - RangeSlider */}

          {/* 床型 */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Bed Type</h3>
            <Client_BedType></Client_BedType>
          </div>
          {/* 床型 */}

          {/** 飯店星級 */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Rating</h3>
            <Client_Rating></Client_Rating>
          </div>
          {/** 飯店星級 */}


          {/** 設施 */}
          <div className="mb-6">
          <h3 className="font-medium mb-3">Facility</h3>
          <Client_Faciliy></Client_Faciliy>
          </div>
          {/** 設施 */}

        </div>

        {/** 重置 & 確定 按鈕 */}
        <div className="flex border-t border-gray p-4 gap-4 justify-between items-center">      
          <button className="basis-1/2 py-2 border border-gray rounded" onClick={reset}>Reset</button>
          <button className="basis-1/2 py-2 rounded bg-primary">Apply</button>
        </div>
        {/** 重置 & 確定 按鈕 */}
      </form>


    </Modal>}
    {/** Filter 彈跳視窗 */}
  </>
}