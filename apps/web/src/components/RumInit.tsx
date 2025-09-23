'use client';
import { useEffect } from 'react';
import { initRUM } from '../lib/rum';
export default function RumInit() {
  useEffect(() => {
    initRUM();
  }, []);
  return null;
}
