import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Half_Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed h-full inset-0 z-50 flex  bg-black bg-opacity-50 animate-slide-up">
      <div className="relative w-full mx-auto rounded-lg shadow-lg overflow-auto top-1/2 bg-gradient-to-b from-[#F9F9F9] to-slate-50">
        <button className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
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
