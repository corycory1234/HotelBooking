// import { ReactNode } from "react";
import ReactDOM from "react-dom";
import Hotel_List from "../../fakeData/hotel_List.json";

// 1. Props傳遞數據 給Modal彈跳視窗 之 interface
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  sort_Value: string; // 傳遞<input type="radio">的值, 以便 radio 高亮
  set_Sort_Value: React.Dispatch<React.SetStateAction<string>>; // 傳遞<input type="radio">之函式
  // children: ReactNode;
}

export default function Half_Modal({ isOpen, onClose, sort_Value, set_Sort_Value }: ModalProps) {

  // 2. 沒props過來，整包 Half_Modal 為 null，因此不渲染
  if (!isOpen) return null;

  // 3. 排序 - Switch Case 綜合函式
  const sortHotels = (sort_Option: string) => {
    switch(sort_Option) {
      case "priceLow":
        Hotel_List.sort((a, b) => a.price - b.price); // 2. 排序 - 最低價 >> 最高價
        break;
      case "priceHigh":
        Hotel_List.sort((a, b) => b.price - a.price); // 3. 排序 - 最高價  >> 最低價
        break;
      case "ratingHigh":
        Hotel_List.sort((a, b) => b.rating - a.rating); // 4. 排序 - 最低評價 >> 最高評價
        break;
      case "ratingLow":
        Hotel_List.sort((a, b) => a.rating - b.rating); // 5. 排序 - 最高評價 >> 最低評價
        break;
    };
    set_Sort_Value(sort_Option); // <input type="radio"> 高亮
    console.log(sort_Value, 123);
    onClose() // 選完 <input type="radio">, 關 modal彈跳
  }



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
        <div className="flex flex-col pt-12">
          <p className="px-4 pb-4 text-lg font-bold">Sort By</p>
          <form action="" className="flex flex-col justify-between gap-4">

              <div className="flex justify-between px-4">
                <label htmlFor="priceLow">{`Price (Low ~ High)`}</label>
                <input type="radio" name="sort" id="priceLow" value="priceLow" onChange={() => sortHotels("priceLow")}
                checked={sort_Value === "priceLow"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="priceHigh">{`Price (High ~ Low)`}</label>
                <input type="radio" name="sort" id="priceHigh" value="priceHigh" onChange={() => sortHotels("priceHigh")}
                checked={sort_Value === "priceHigh"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="ratingHigh">{`Rating (High ~ Low)`}</label>
                <input type="radio" name="sort" id="ratingHigh" value="ratingHigh" onChange={() => sortHotels("ratingHigh")}
                checked={sort_Value === "ratingHigh"}/>
              </div>
              <div className="flex justify-between px-4">
                <label htmlFor="ratingLow">{`Rating (Low ~ High)`}</label>
                <input type="radio" name="sort" id="ratingLow" value="ratingLow" onChange={() => sortHotels("ratingLow")}
                checked={sort_Value === "ratingLow"}/>
              </div>

            {/* <div className="flex justify-between gap-2 px-4">
              <button type="button" className="basis-1/2 bg-white rounded-lg border border-gray p-1" onClick={onClose}> Cancel </button>
              <button type="button" className="basis-1/2 bg-primary rounded-lg p-1"> Apply </button>
            </div> */}

          </form>
        </div>
        {/* ↑↓Sort 排序 - 彈跳Modal  */}

        {/* {children} */}
      </div>
    </div>,
    document.body
  );
}
