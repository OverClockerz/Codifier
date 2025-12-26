import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '../../../types/types';

interface ConfirmationModalProps {
  isOpen: boolean;
  pendingLanguage: SupportedLanguage | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  pendingLanguage, 
  onCancel, 
  onConfirm 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
       <div className="bg-[#1e293b] border border-slate-600 p-6 rounded-lg shadow-2xl max-w-sm w-full">
          <div className="flex items-center gap-3 text-amber-400 mb-4">
             <AlertTriangle size={24} />
             <h3 className="text-lg font-bold text-white">Change Language?</h3>
          </div>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            Switching to <strong className="text-white capitalize">{pendingLanguage}</strong> will discard your current code. Are you sure you want to proceed?
          </p>
          <div className="flex justify-end gap-3">
             <button 
               onClick={onCancel}
               className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium"
             >
               Cancel
             </button>
             <button 
               onClick={onConfirm}
               className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-sm font-medium"
             >
               Yes, Discard Code
             </button>
          </div>
       </div>
    </div>
  );
};