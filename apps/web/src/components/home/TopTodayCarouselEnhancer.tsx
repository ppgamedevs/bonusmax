'use client';
import { useEffect } from 'react';

export default function TopTodayCarouselEnhancer({ id }: { id: string }) {
  useEffect(() => {
    const scroller = document.getElementById(`${id}-scroller`);
    const left = document.getElementById(`${id}-left`);
    const right = document.getElementById(`${id}-right`);
    if (!scroller || !left || !right) return;

    const onLeft = () => scroller.scrollBy({ left: -Math.max(320, scroller.clientWidth * 0.7), behavior: 'smooth' });
    const onRight = () => scroller.scrollBy({ left: Math.max(320, scroller.clientWidth * 0.7), behavior: 'smooth' });

    left.addEventListener('click', onLeft);
    right.addEventListener('click', onRight);
    return () => {
      left.removeEventListener('click', onLeft);
      right.removeEventListener('click', onRight);
    };
  }, [id]);

  return null;
}
