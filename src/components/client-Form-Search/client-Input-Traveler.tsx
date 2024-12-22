'use client';
import { useState } from "react";

export default function Client_Input_Traveler () {
  const [room, setRoom] = useState<number>(1);
  const [adult, setAdult] = useState<number>(1);
  const [child, setChild] = useState<number>(0);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  
  const addRoom = (num: number) => {
    setRoom(room + num);
  };
  const minusRoom = (num: number) => {
    if(room <=1) return;
    setRoom(room - num);
  };
  
  const addAdult = (num: number) => {
    setAdult(adult + num);
  };
  const minusAdult= (num: number) => {
    if(adult <=1) return;
    setAdult(adult - num);
  };

  const addChild = (num: number) => {
    setChild(child + num);
  };
  const minusChild = (num: number) => {
    if(child <=0) return;
    setChild(child - num)
  }

  // 1. 打開 選人數清單
  const toggle_ShowDropDown = () => {
    setShowDropDown(!showDropDown)
  }

  return <>
    <div className="relative w-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute right-2 text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
      <button className="w-full px-4 rounded outline-none hover:outline-secondary text-left bg-white"
        onClick={toggle_ShowDropDown}
        type="button">
        {`${room} Room – ${adult} Adult, ${child} Child`}
      </button>

    {/* DropDown 選人清單 */}
      { showDropDown &&
        <div className="flex flex-col gap-2 pl-4 pr-2">
          {/* 房間 */}
          <div className="flex justify-between items-center py-2 border-b-2">
            <p>{room} Room</p>
            <div className="flex gap-4">
              <button onClick={() => minusRoom(1)} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${room<=1 ? 'text-gray-400' : 'text-primary'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>

              <button onClick={() => addRoom(1)} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </div>
          {/* 房間 */}

          {/* 成人 */}
          <div className="flex justify-between items-center py-2 border-b-2">
            <p>{adult} Adult</p>
            <div className="flex gap-4">
              <button onClick={() => minusAdult(1)} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${adult<=1 ? 'text-gray-400' : 'text-primary'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>

              <button onClick={() => addAdult(1)} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </div>
          {/* 成人 */}

          {/* 小孩 */}
          <div className="flex justify-between items-center py-2 border-b-2">
            <p>{child} Child</p>
            <div className="flex gap-4">
              <button onClick={() => minusChild(1)} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${child<=1 ? 'text-gray-400' : 'text-primary'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>

              <button onClick={() => addChild(1)} type="button">
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