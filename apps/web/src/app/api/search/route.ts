export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { NextResponse } from 'next/server';
import { searchOffersAndOperators } from '@bonusmax/lib';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const data = await searchOffersAndOperators(q);
  return NextResponse.json(data);
}
