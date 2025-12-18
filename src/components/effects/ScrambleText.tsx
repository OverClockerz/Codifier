import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  scrambleSpeed?: number;
  characters?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  delay?: number;
}

export function ScrambleText({
  text,
  className = '',
  speed = 50,
  scrambleSpeed = 30,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  as = 'span',
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsScrambling(true);
      let currentIndex = 0;
      let scrambleInterval: NodeJS.Timeout;

      const revealInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          const revealed = text.slice(0, currentIndex);
          const scrambled = text
            .slice(currentIndex)
            .split('')
            .map(() => characters[Math.floor(Math.random() * characters.length)])
            .join('');

          setDisplayText(revealed + scrambled);
          currentIndex++;
        } else {
          clearInterval(revealInterval);
          clearInterval(scrambleInterval);
          setDisplayText(text);
          setIsScrambling(false);
        }
      }, speed);

      scrambleInterval = setInterval(() => {
        if (currentIndex < text.length) {
          const revealed = text.slice(0, currentIndex);
          const scrambled = text
            .slice(currentIndex)
            .split('')
            .map(() => characters[Math.floor(Math.random() * characters.length)])
            .join('');

          setDisplayText(revealed + scrambled);
        }
      }, scrambleSpeed);

      return () => {
        clearInterval(revealInterval);
        clearInterval(scrambleInterval);
      };
    }, delay);

    return () => clearTimeout(startDelay);
  }, [text, speed, scrambleSpeed, characters, delay]);

  const Component = motion[as];

  return (
    <Component className={className}>
      {displayText || text.split('').map(() => ' ').join('')}
    </Component>
  );
}

// Variant that triggers on hover
export function ScrambleTextOnHover({
  text,
  className = '',
  scrambleSpeed = 30,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
}: Omit<ScrambleTextProps, 'speed' | 'delay' | 'as'>) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [isHovering, text, characters, scrambleSpeed]);

  return (
    <span
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayText}
    </span>
  );
}
