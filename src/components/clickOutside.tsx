// 1. 旅客下拉選單, 點擊外層, 隱藏
'use client'
import { useEffect } from 'react';

export default function Click_Outside  (ref: React.RefObject<HTMLElement | null>, callback: () => void)  {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};

