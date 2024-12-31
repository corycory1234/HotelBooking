'use client';
import Modal from "./modal/modal";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Submit_Search } from "@/actions";
import { useSearchParams } from "next/navigation";
import { updateBedType, updateRating } from "@/store/form-Search/formSearchSlice";

export default function Client_Filter_Button () {
  // 0.
  const dispatch: AppDispatch = useDispatch();

  // 1.  取 Redux「搜尋相關數據」
  const destination = useSelector((state: RootState) => state.formSearch.keyword);
  const storedDateRange = useSelector((state: RootState) => state.formSearch.dateRange);
  const room = useSelector((state: RootState) => state.formSearch.room);
  const adult = useSelector((state: RootState) => state.formSearch.adult);
  const child = useSelector((state: RootState) => state.formSearch.child);

  // 2. 飯店星級陣列
  const [checked_Rating, set_Checked_Rating] = useState<number[]>([]);
  const handel_Rating = (rating: number, isChecked: boolean) => {
    if(isChecked) {
      set_Checked_Rating(prev => [...prev, rating])
    } else {
      set_Checked_Rating(prev => prev.filter(item => item !== rating))
    }
  };
  const bedTypeFromStore = useSelector((state: RootState) => state.formSearch.bedType);

  // 3. 房型陣列
  const [checked_Beds, set_Checked_Beds] = useState<string[]>([]);
  const handel_CheckBox = (bed: string, isChecked: boolean) => {
    if(isChecked){
      set_Checked_Beds(prev => [...prev, bed]);
    } else {
      set_Checked_Beds(prev => prev.filter(item => item !== bed));
    }
  };
  const ratingFromStore = useSelector((state: RootState) => state.formSearch.rating);

  // 4.
  const handleSubmit = () => {
    // 一次把整個 checked_Beds陣列、checked_Rating陣列 都丟給 Redux
    dispatch(updateBedType(checked_Beds));
    dispatch(updateRating(checked_Rating));
  };


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

  // 5. 監聽 Redux - 房型 bedType
  useEffect(() => {
    if(bedTypeFromStore){
      set_Checked_Beds(bedTypeFromStore)
    } else {
      set_Checked_Beds([])
    }
  },[bedTypeFromStore]);

  // 6. 監聽 Redux - 飯店星級 rating
  useEffect(() => {
    // ratingFromStore 可能是 null 或 number[]
    if (ratingFromStore) {
      set_Checked_Rating(ratingFromStore);
    } else {
      set_Checked_Rating([]);
    }
  }, [ratingFromStore]);

  // 7. 初始化所有篩選條件 - 按下也會直接關Modal, 有BUG, 
  // 7.1 觸發到 Server Action, 但改成 tpye="button", 再F5, 篩選條件仍是上次的Redux狀態  
  const reset = () => {
    set_Checked_Beds([]);
    set_Checked_Rating([]);
  }




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


      <form action={Submit_Search} className="mx-auto flex flex-col">
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
          <div className="mb-6">        <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray rounded-lg text-sm" />          
              <span className="text-gray-400">-</span>
              <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray rounded-lg text-sm" />        
            </div>
          </div>

          {/* 床型 */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Bed Type</h3>
            <div className="space-y-2">          
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="singleBed" name="bedType"
                checked={checked_Beds.includes("singleBed")}
                onChange={(event) => handel_CheckBox(event.target.value, event.target.checked)}/>
                <span>Single Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="twinBed" name="bedType"
                checked={checked_Beds.includes("twinBed")}
                onChange={(event) => handel_CheckBox(event.target.value, event.target.checked)}/>            
                <span>Twin Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="doubleBed" name="bedType"
                checked={checked_Beds.includes("doubleBed")}
                onChange={(event) => handel_CheckBox(event.target.value, event.target.checked)}/>            
                <span>Double Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="queenBed" name="bedType"
                checked={checked_Beds.includes("queenBed")}
                onChange={(event) => handel_CheckBox(event.target.value, event.target.checked)}/>            
                <span>Queen Bed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray" value="kingBed" name="bedType"
                checked={checked_Beds.includes("kingBed")}
                onChange={(event) => handel_CheckBox(event.target.value, event.target.checked)}/>            
                <span>King Bed</span>
              </label>
            </div>
          </div>
          {/* 床型 */}

          {/** 飯店星級 */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                  <input type="checkbox" name="rating" className="w-4 h-4" value={5}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={checked_Rating.includes(5)}/>            
                    <div className="flex text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                    </div>          
                </label>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" name="rating" className="w-4 h-4" value={4}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={checked_Rating.includes(4)}/>            
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                  </div>          
              </label>


              <label className="flex items-center gap-2">
                <input type="checkbox" name="rating" className="w-4 h-4" value={3}
                  onChange={(event) => handel_Rating(+ event.target.value, event.target.checked)}
                  checked={checked_Rating.includes(3)}/>            
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-400">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </div>          
                </label>
            </div>
          </div>
          {/** 飯店星級 */}



          <div className="mb-6">
            <h3 className="font-medium mb-3">Brands</h3>
            <input type="search" placeholder="Search brands" className="w-full px-3 py-2 border border-gray rounded-lg mb-3 text-sm"/>        <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray"/>            
                <span>Apple</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray"/>            
                <span>Samsung</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray"/>            
                <span>Nike</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray"/>            
                <span>Adidas</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Sort By</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="sort" className="w-4 h-4"/>            
                <span>Latest</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="sort" className="w-4 h-4"/>            
                <span>Popular</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="sort" className="w-4 h-4"/>            
                <span>Price: High to Low</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="sort" className="w-4 h-4"/>            
                <span>Price: Low to High</span>
              </label>
            </div>
          </div>
        </div>

        {/** 重置 & 確定 按鈕 */}
        <div className="flex border-t border-gray p-4 gap-4 justify-between items-center">      
          <button className="basis-1/2 py-2 border border-gray rounded" onClick={reset}>Reset</button>
          <button className="basis-1/2 py-2 rounded bg-primary" onClick={handleSubmit}>Apply</button>
        </div>
        {/** 重置 & 確定 按鈕 */}
      </form>


    </Modal>}
    {/** Filter 彈跳視窗 */}
  </>
}