'use client';
import Image, { type ImageProps } from 'next/image';

// Implicit: container ~1100px, 100vw pe mobil, 90vw pe tablet
const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px';

// Wrapper mic care setează `sizes` dacă lipsește
export default function Img(props: ImageProps & { sizes?: string }) {
  const { sizes, alt, ...rest } = props as any;
  return <Image alt={alt} sizes={sizes || DEFAULT_SIZES} {...rest} />;
}
