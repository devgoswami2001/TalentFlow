"use client";

import { useState, useEffect } from 'react';

type TypingEffectProps = {
  text: string;
  speed?: number;
  className?: string;
};

export function TypingEffect({ text, speed = 100, className }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return <span className={className}>{displayedText}</span>;
}
