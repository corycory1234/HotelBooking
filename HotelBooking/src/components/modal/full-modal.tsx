import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Full_Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50 h-screen">
      <div className="relative w-full mx-auto rounded-lg shadow-lg overflow-auto h-full bg-zinc-900
      flex items-center justify-center">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-[999]"
          onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="w-full max-w-4xl max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
