import React from 'react';

interface SubmitModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
    isOpen,
    title = 'Confirm Submission',
    message,
    primaryLabel = 'Submit',
    secondaryLabel = 'Cancel',
    onCancel,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0b1220] border border-slate-800 p-6 rounded-2xl max-w-lg w-full">
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-300 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">{secondaryLabel}</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">{primaryLabel}</button>
                </div>
            </div>
        </div>
    );
};
