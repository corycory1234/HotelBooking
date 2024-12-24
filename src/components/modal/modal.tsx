// 'use client';
// import Server_Form_Search from "../server-Form-Search/server-Form-Search"
// import { useState } from "react"

// export default function Modal () {
//   const [showModal, setShowModal] = useState(false);

//   return <>
//     {/* <div className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-80 flex justify-center items-center">
//       <Server_Form_Search></Server_Form_Search>
//     </div> */}

// <div className="relative">
//   <button
//     className="bg-blue-500 text-white px-4 py-2 rounded"
//     onClick={() => setShowModal(true)}
//   >
//     打開 Modal
//   </button>

//   {showModal && (
//     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">全螢幕 Modal</h2>
//         <p className="text-gray-700 mb-4">這是一個示例的全螢幕 Modal 視窗。</p>
//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded"
//           onClick={() => setShowModal(false)}
//         >
//           關閉
//         </button>
//       </div>
//     </div>
//   )}
// </div>
  
//   </>
// }


import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex  bg-black bg-opacity-50">
      <div className="relative w-full mx-auto rounded-lg shadow-lg overflow-auto h-full max-w-3xl bg-gradient-to-b from-[#F9F9F9] to-slate-50">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
