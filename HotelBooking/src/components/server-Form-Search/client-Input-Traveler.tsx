'use client';
import { useState, useRef } from "react";
import Click_Outside from "../clickOutside";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, minusRoom, addAdult, minusAdult, addChild, minusChild  } from "../../store/form-Search/formSearchSlice";
import { RootState, AppDispatch } from "../../store/store";

export default function Client_Input_Traveler () {
  // 1. 提取Redux - formSearch 表單 Room房間量、Adult成人、Child小孩
  const dispatch: AppDispatch = useDispatch();
  const room = useSelector((state: RootState) => state.formSearch!.room);
  const adult = useSelector((state: RootState) => state.formSearch!.adult);
  const child = useSelector((state: RootState) => state.formSearch!.child);


  // 3. 建立 ref 來追蹤 dropdown 元素
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  
  // 1. 打開 選人數清單
  const toggle_ShowDropDown = () => {
    setShowDropDown(!showDropDown)
  }

  // 2. 點外層, 隱藏 房間人數下拉選單
  Click_Outside(dropDownRef, () => setShowDropDown(false))

  return <>
    {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}
      <input type="hidden" name="room" value={room} />
      <input type="hidden" name="adult" value={adult} />
      <input type="hidden" name="child" value={child} />
    {/* 讓<Client_Form_Search>表單可以拿到這三個值 */}

    <div className="relative w-full" ref={dropDownRef}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-2 right-2 text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
      <button className="w-full py-2 px-4 rounded outline-none hover:outline-secondary text-left bg-white"
        onClick={toggle_ShowDropDown}
        type="button">
        {`${room} Room – ${adult} Adult, ${child} Child`}
      </button>

    {/* DropDown 選人清單 */}
      { showDropDown &&
        <div className="flex flex-col gap-2 pl-4 pr-2">
          {/* 房間 */}
          <div className="flex justify-between items-center py-2 border-b-2 border-gray">
            <p>{room} Room</p>
            <div className="flex gap-4">
              <button onClick={() => dispatch(minusRoom())} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${room<=1 ? 'text-gray' : 'text-primary'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>

              <button onClick={() => dispatch(addRoom())} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </div>
          {/* 房間 */}

          {/* 成人 */}
          <div className="flex justify-between items-center py-2 border-b-2 border-gray">
            <p>{adult} Adult</p>
            <div className="flex gap-4">
              <button onClick={() => dispatch(minusAdult())} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${adult<=1 ? 'text-gray' : 'text-primary'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>

              <button onClick={() => dispatch(addAdult())} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </div>
          {/* 成人 */}

          {/* 小孩 */}
          <div className="flex justify-between items-center py-2 border-b-2 border-gray">
            <p>{child} Child</p>
            <div className="flex gap-4">
              <button onClick={() => dispatch(minusChild())} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${child<=0 ? 'text-gray' : 'text-primary'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>

              <button onClick={() => dispatch(addChild())} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </div>
          {/* 小孩 */}

        </div>
      }
    {/* DropDown 選人清單 */}

    </div>
  </>
}