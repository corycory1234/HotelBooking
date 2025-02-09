import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Submit_Search } from "@/actions";
import Client_RangeSlider from "../form_Search/client_RangeSlider";
import Client_BedType from "../form_Search/client_BedType";
import Client_Rating from "../form_Search/client_Rating";
import Client_Faciliy from "../form_Search/client_Facility";
import { updateRangeSlider, updateBedType, updateRating, updateFacility } from "@/store/form-Search/formSearchSlice";

export default function Advanced_Search_Pc () {
  // 0. 取 Redux - Action「搜尋相關函式」
  const dispatch: AppDispatch = useDispatch();

  // 1.  取 Redux「搜尋相關數據」
  const destination = useSelector((state: RootState) => state.formSearch.keyword);
  const storedDateRange = useSelector((state: RootState) => state.formSearch.dateRange);
  const room = useSelector((state: RootState) => state.formSearch.room);
  const adult = useSelector((state: RootState) => state.formSearch.adult);
  const child = useSelector((state: RootState) => state.formSearch.child);

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

  // 5. 初始化所有篩選條件 
  const reset = () => {
    dispatch(updateRangeSlider([0,9999]));
    dispatch(updateBedType([]));
    dispatch(updateRating([]));
    dispatch(updateFacility([]));
  }



  return <>
      <form ref={formRef} onSubmit={handleFormSubmit} className="mx-auto flex flex-col h-[580px] overflow-auto">
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}
          <input type="hidden" name="destination" value={destination} />
          <input type="hidden" name="datepicker" value={storedDateRange || ""} />
          <input type="hidden" name="room" value={room} />
          <input type="hidden" name="adult" value={adult} />
          <input type="hidden" name="child" value={child} />
        {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}

        <div className="flex justify-between items-center p-4 border-b border-softGray">
          <h2 className="text-lg font-semibold">Advanced Search</h2>
        </div>

        <div className="flex flex-col overflow-y-auto px-4 py-2 gap-6">
          
          {/** 最小最大旅館價格 - RangeSlider */}
          <div className="pb-4">        
            <h3 className="font-medium mb-3">Price Range</h3>
              <Client_RangeSlider></Client_RangeSlider>
          </div>
          <div className="border-b border-softGray"></div>
          {/** 最小最大旅館價格 - RangeSlider */}

          {/* 床型 */}
          <div className="border-b border-softGray pb-4">
            <h3 className="font-medium mb-3">Bed Type</h3>
            <Client_BedType></Client_BedType>
          </div>
          {/* 床型 */}

          {/** 飯店星級 */}
          <div className="border-b border-softGray pb-4">
            <h3 className="font-medium mb-3">Rating</h3>
            <Client_Rating></Client_Rating>
          </div>
          {/** 飯店星級 */}


          {/** 設施 */}
          <div className="">
          <h3 className="font-medium mb-3">Facility</h3>
          <Client_Faciliy></Client_Faciliy>
          </div>
          {/** 設施 */}

        </div>

        {/** 重置 & 確定 按鈕 */}
        <div className="flex border-t border-softGray p-4 gap-4 justify-between items-center">      
          <button className="basis-1/2 py-2 border border-gray rounded" type="button" onClick={reset}>Reset</button>
          <button className="basis-1/2 py-2 rounded bg-primary text-white">Apply</button>
        </div>
        {/** 重置 & 確定 按鈕 */}
      </form>

  </>
}