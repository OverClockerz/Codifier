import React, { useState } from "react";
import { ShopItem } from "../../types/game";

interface ShopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  item: ShopItem;
  onPurchase: (item: ShopItem) => void;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

const styles = `
  @keyframes floatUpFade {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    50% { opacity: 1; transform: translateY(-30px) scale(1.4); }
    100% { opacity: 0; transform: translateY(-60px) scale(1); }
  }

  .sparkle-anim {
    position: fixed;
    color: #39ff14; /* Neon Green */
    font-family: 'Verdana', sans-serif;
    font-weight: 900;
    font-size: 1.5rem;
    pointer-events: none;
    z-index: 9999;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 0px 5px rgba(57, 255, 20, 0.5);
    animation: floatUpFade 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
`;

export const ShopButton: React.FC<ShopButtonProps> = ({
  item,
  onPurchase,
  className,
  children,
  ...props
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newSparkle = { id: Date.now(), x: e.clientX, y: e.clientY };
    setSparkles((prev) => [...prev, newSparkle]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id)), 800);

    if (onPurchase) onPurchase(item);
  };

  return (
    <>
      <style>{styles}</style>
      <button
        onClick={handleClick}
        // ✅ KEY CHANGE: active:scale-90 makes it shrink 10%
        // ✅ transition-all ensures the shrink is smooth
        className={`relative transform transition-all duration-75 active:scale-90 ${className}`}
        {...props}
      >
        {children || `Buy ${item.name}`}
      </button>
      {sparkles.map((s) => (
        <span key={s.id} className="sparkle-anim" style={{ left: s.x, top: s.y - 30 }}>+1</span>
      ))}
    </>
  );
};