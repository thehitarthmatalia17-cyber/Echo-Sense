import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border-[2.5px] border-black shadow-brutal-lg transform transition-all scale-100 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shrink-0 shadow-brutal-xs ${
                isDestructive ? 'bg-red-400 text-black' : 'bg-[#FFC700] text-black'
              }`}
            >
              <AlertCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:bg-gray-100 p-1.5 rounded-lg border border-black shadow-brutal-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <p className="mt-4 text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed">{description}</p>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-gray-100 border-2 border-black rounded-xl shadow-brutal-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black transition-all cursor-pointer shadow-brutal active:translate-x-0.5 active:translate-y-0.5 ${
              isDestructive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[#FFC700] hover:bg-[#FFD233] text-black'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
