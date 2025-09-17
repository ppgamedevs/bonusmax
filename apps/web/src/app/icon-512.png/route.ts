import React from 'react';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export async function GET() {
  const element = React.createElement(
    'div',
    {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B0B0B',
        color: 'white',
        fontSize: 236,
        fontWeight: 700,
        letterSpacing: -4
      }
    },
    'BM'
  );

  return new ImageResponse(element, { width: 512, height: 512 });
}
