import { NextResponse } from 'next/server';
import { prisma } from '@bonusmax/lib';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') || '';
  
  // Use the same auth as the seed endpoint
  const secret = (process.env.BLOG_SEED_SECRET || process.env.NEXT_PUBLIC_BLOG_SEED_SECRET || '').trim();
  if (!secret || key !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    // Test basic database connectivity
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Test if the required tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('FeedItem', 'Tag', 'FeedItemTag')
      ORDER BY table_name
    `;

    // Test if we can query the FeedItem table
    let feedItemCount = null;
    try {
      feedItemCount = await prisma.feedItem.count();
    } catch (e) {
      feedItemCount = `Error: ${e.message}`;
    }

    return NextResponse.json({
      ok: true,
      database_connected: !!result,
      tables_found: tables,
      feed_item_count: feedItemCount,
      prisma_version: require('@prisma/client/package.json').version,
      node_env: process.env.NODE_ENV,
      database_url_exists: !!process.env.DATABASE_URL,
    });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error.message,
      error_code: error.code,
      error_name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
