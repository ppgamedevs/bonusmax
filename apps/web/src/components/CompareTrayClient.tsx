'use client';
import dynamic from 'next/dynamic';

const Compare = dynamic(() => import('./CompareTray'), { ssr: false, loading: () => null });

export default function CompareTrayClient() {
  return <Compare />;
}
