import React from 'react';

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  type?: 'success' | 'error'; // Optional: allow different colors
}

// Internal CSS for the slide animation
const styles = `
  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .snackbar-container {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 10000; /* High z-index to sit on top of everything */
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    color: white;
    font-weight: 500;
    min-width: 250px;
    animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .snackbar-success { background-color: #1f2937; /* Gray-800 */ border-left: 4px solid #22c55e; }
  .snackbar-error { background-color: #1f2937; border-left: 4px solid #ef4444; }
`;

export const Snackbar: React.FC<SnackbarProps> = ({ message, isOpen, type = 'success' }) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div className={`snackbar-container ${type === 'success' ? 'snackbar-success' : 'snackbar-error'}`}>
        {/* Icon based on type */}
        <span>{type === 'success' ? '✅' : '⚠️'}</span>
        <span>{message}</span>
      </div>
    </>
  );
};