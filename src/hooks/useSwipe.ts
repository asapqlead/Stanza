import { useRef, TouchEvent } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export const useSwipe = ({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions) => {
  const startX = useRef<number>(0);

  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < threshold) return;
    if (diff > 0) onSwipeLeft?.();
    else onSwipeRight?.();
  };

  return { onTouchStart, onTouchEnd };
};
