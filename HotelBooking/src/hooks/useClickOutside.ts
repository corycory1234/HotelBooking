// 1. useClickOiutside 自定義鉤子, 點外層, 關閉(彈跳)視窗
'use client'
import { useEffect, RefObject } from 'react';

export default function useClickOutside  (ref: RefObject<HTMLElement | null>, callback: () => void) {
  
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

