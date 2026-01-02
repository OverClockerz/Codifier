import React, { useEffect } from 'react';

type AlertProps = {
  onRestart: () => void;
};

const AlertComponent = ({ onRestart }: AlertProps) => {
  useEffect(() => {
    console.debug('[AlertComponent] mounted');
  }, []);

  return (
    // OVERLAY: Dark, blurred backdrop keeping high z-index
    <div 
      role="dialog" 
      aria-modal="true" 
      tabIndex={-1} 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 font-sans"
    >
      
      {/* MODAL CONTAINER: Standard pop-up box shape with shadow and animation */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-200">
        
        {/* HEADER: Red alert banner */}
        <div className="bg-red-600 p-6 text-white flex items-start gap-4 relative overflow-hidden">
           {/* Background Icon Accent */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 rotate-[-15deg] pointer-events-none">
             <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
           </svg>

           {/* Main Icon */}
           <div className="bg-white/20 p-3 rounded-full shrink-0 relative z-10">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
             </svg>
           </div>
           
           <div className="relative z-10">
             <h2 className="text-2xl font-bold uppercase tracking-tight leading-none">Terminated</h2>
             <p className="text-red-100 text-sm font-medium mt-1">Critical Reputation Failure</p>
           </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 pt-8">
           <h3 className="text-lg font-semibold text-slate-900 mb-2">It's over.</h3>
           <p className="text-slate-700 text-[15px] leading-relaxed">
             Your professional reputation score has dropped below the acceptable threshold <span className="font-bold text-red-600 whitespace-nowrap">(-20)</span>.
           </p>
           <p className="text-slate-600 text-sm mt-4 leading-relaxed">
             As a result, your employment contract has been cancelled effective immediately. Access to all office systems has been revoked.
           </p>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-slate-50 p-4 flex justify-end border-t border-slate-100">
          <button 
            onClick={onRestart}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all hover:shadow-lg active:scale-[0.98] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Restart Game
          </button>
        </div>

      </div>
    </div>
  );
};

export default AlertComponent;