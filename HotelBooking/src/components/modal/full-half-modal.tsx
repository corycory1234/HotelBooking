import { ReactNode, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Full_Half_Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;


  return ReactDOM.createPortal(
    
    <div className="hidden fixed inset-0 z-50 lg:flex bg-black bg-opacity-80 h-screen cursor-pointer"
      onClick={ onClose}>
      {/** 點黑透明背景, 會關Modal視窗 */}    

      <div className="relative w-full overflow-auto h-full flex justify-end">
        <button className="absolute top-3 right-[27%] text-gray-500 hover:text-gray-700 z-[999]"
          onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/** 冒泡事件, 點白背景, 不會關Modal視窗 */}
        <div className="w-[30%] h-screen bg-white flex flex-col px-2 py-10" onClick={(event) => event.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
