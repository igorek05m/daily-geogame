import { ModalProps } from "@/app/types";

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1e1e1e] border border-[#333] w-full max-w-lg rounded-lg shadow-2xl relative flex flex-col max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#333]">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-gray-300 font-mono text-sm leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};