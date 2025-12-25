import { useState, useCallback } from 'react';

export const useSnackbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');

  const triggerSnackbar = useCallback((msg: string) => {
    setMessage(msg);
    setIsActive(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setIsActive(false);
    }, 3000);
  }, []);

  return { isActive, message, triggerSnackbar };
};