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
        fontSize: 96,
        fontWeight: 700,
        letterSpacing: -2
      }
    },
    'BM'
  );

  return new ImageResponse(element, { width: 192, height: 192 });
}
