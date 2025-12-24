import { useState, useEffect } from 'react';

export function DigitalClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    // Update immediately
    updateTime();

    // Update every second to catch minute changes
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-950/30 border border-blue-900/50 rounded-lg">
      <div 
        className="text-2xl tracking-wider text-blue-400 font-mono"
        style={{
          fontFamily: "'Courier New', monospace",
          textShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
          letterSpacing: '0.2em',
          fontWeight: 'bold',
          filter: 'contrast(1.2)',
        }}
      >
        {time}
      </div>
    </div>
  );
}
