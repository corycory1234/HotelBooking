import { ReactNode } from "react";
import ReactDOM from "react-dom";
// import Hotel_List from "../../fakeData/hotel_List.json";
import Hotel_List from "@/fakeData/hotel_List.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { update_Hotel_List } from "@/store/hotel_List/hotel_List_Slice";

// 1. Props傳遞數據 給Modal彈跳視窗 之 interface
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  sort_Value: string; // 傳遞<input type="radio">的值, 以便 radio 高亮
  set_Sort_Value: React.Dispatch<React.SetStateAction<string>>; // 傳遞<input type="radio">之函式
  children: ReactNode;
}

export default function Half_Modal({ isOpen, onClose, sort_Value, set_Sort_Value, children }: ModalProps) {
  // 1. Redux - 原始飯店列表
  // const redux_Hotel_List = useSelector((state: RootState) => state.hotel_List2.hotel_List);
  // const dispatch: AppDispatch = useDispatch() 

  // 2. 被 sorted 飯店列表, 不可拿 redux_Hotel_List 去排序, 因為沒有寫 Redux - Action。 
  // 2.1 再者, 這種偏簡單的排序, 直接寫在前端元件就好, 沒必要再回去更新 Redux, 減少 Redux boilerplate
  // 2.2 先忽略2點與2.1點 ↑ 這邊切太多元件, 設計沒做好。
  // 2.3 最後, 再將重新排序後的飯店列表, dispatch傳數據給 Redux 飯店列表...這邊設計沒做好, 暫時只好去變動最原始的Redux - 飯店列表
  // let sorted_Hotel_List: add_Hotel_Detail_Interface[] = [] 


  // 2. 沒props過來，整包 Half_Modal 為 null，因此不渲染
  if (!isOpen) return null;

  // 3. 排序 - Switch Case 綜合函式
  // const sortHotels = (sort_Option: string) => {
  //   switch(sort_Option) {
  //     case "priceLow":
  //       sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (a.price as number) - (b.price as number)); // 2. 排序 - 最低價 >> 最高價
  //       break;
  //     case "priceHigh":
  //       sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (b.price as number) - (a.price as number)); // 3. 排序 - 最高價  >> 最低價
  //       break;
  //     case "ratingHigh":
  //       sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (b.totalRating as number) - (a.totalRating as number)); // 4. 排序 - 最低評價 >> 最高評價
  //       break;
  //     case "ratingLow":
  //       sorted_Hotel_List = [...redux_Hotel_List].sort((a, b) => (a.totalRating as number) - (b.totalRating as number)); // 5. 排序 - 最高評價 >> 最低評價
  //       break;
  //   };
  //   set_Sort_Value(sort_Option); // <input type="radio"> 高亮
  //   console.log(sort_Value, 123);
  //   dispatch(update_Hotel_List(sorted_Hotel_List));
  //   onClose() // 選完 <input type="radio">, 關 modal彈跳
  // };


  return ReactDOM.createPortal(
    <div className="fixed h-full inset-0 z-50 flex  bg-black bg-opacity-50 animate-slide-up">
      <div className="relative w-full mx-auto rounded-lg shadow-lg overflow-auto top-1/2 bg-gradient-to-b from-[#F9F9F9] to-slate-50">
        <button className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ↑↓Sort 排序 - 彈跳Modal  */}
        {/* <div className="flex flex-col pt-12">
          <p className="px-4 pb-4 text-lg font-bold">{("Sort By")}</p>
          <form action="" className="flex flex-col justify-between gap-4">

              <div className="flex justify-between px-4">
                <label htmlFor="priceLow">{(`Price (Low ~ High)`)}</label>
                <input type="radio" name="sort" id="priceLow" value="priceLow" onChange={() => sortHotels("priceLow")}
                checked={sort_Value === "priceLow"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="priceHigh">{(`Price (High ~ Low)`)}</label>
                <input type="radio" name="sort" id="priceHigh" value="priceHigh" onChange={() => sortHotels("priceHigh")}
                checked={sort_Value === "priceHigh"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="ratingHigh">{(`Rating (High ~ Low)`)}</label>
                <input type="radio" name="sort" id="ratingHigh" value="ratingHigh" onChange={() => sortHotels("ratingHigh")}
                checked={sort_Value === "ratingHigh"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="ratingLow">{(`Rating (Low ~ High)`)}</label>
                <input type="radio" name="sort" id="ratingLow" value="ratingLow" onChange={() => sortHotels("ratingLow")}
                checked={sort_Value === "ratingLow"}/>
              </div>


          </form>
        </div> */}
        {/* ↑↓Sort 排序 - 彈跳Modal  */}

        {children}
      </div>
    </div>,
    document.body
  );
}
