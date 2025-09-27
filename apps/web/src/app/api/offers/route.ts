import { NextResponse } from 'next/server';
import { getActiveOffers } from '@bonusmax/lib';

export const revalidate = 300; // 5 minutes
export const dynamic = 'force-dynamic'; // Enable ISR

// Add response headers for better caching
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'CDN-Cache-Control': 'public, s-maxage=300',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(req: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(req.url);
    const offset = Math.max(0, Number(searchParams.get('offset') || '0'));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '24'))); // Cap at 100

    // Validate parameters
    if (!Number.isFinite(offset) || !Number.isFinite(limit)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid parameters' }, 
        { status: 400, headers: CACHE_HEADERS }
      );
    }

    const offers = await getActiveOffers('RO', { offset, limit });
    
    const response = {
      ok: true,
      offers: offers || [],
      meta: {
        offset,
        limit,
        count: Array.isArray(offers) ? offers.length : 0,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        ...CACHE_HEADERS,
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });
  } catch (e: any) {
    console.error('[API] /api/offers error:', e);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error',
        meta: {
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime,
        }
      }, 
      { 
        status: 500,
        headers: {
          ...CACHE_HEADERS,
          'Cache-Control': 'no-cache, no-store, must-revalidate', // Don't cache errors
        }
      }
    );
  }
}
