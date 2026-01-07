import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot } from 'lucide-react';

interface AiChatOverlayProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const AiChatOverlay: React.FC<AiChatOverlayProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-4 right-4 max-w-sm w-full bg-[#1e293b] border border-blue-500/30 shadow-2xl shadow-black/50 rounded-xl p-0 z-20 overflow-hidden animation-fade-in-up">
       <div className="flex justify-between items-center p-3 bg-slate-800 border-b border-slate-700">
         <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
           <Bot size={16} /> AI Assistant
         </div>
         <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">×</button>
       </div>
       <div className="p-4 max-h-60 overflow-y-auto custom-scrollbar">
          <div className="markdown-body text-xs text-slate-300 leading-relaxed">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
       </div>
    </div>
  );
};