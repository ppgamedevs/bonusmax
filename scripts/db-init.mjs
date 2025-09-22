#!/usr/bin/env node
import { execSync } from 'node:child_process';

// Resolve the best available UNPOOLED/Direct connection URL from environment
const candidates = [
  process.env.DATABASE_URL_UNPOOLED,
  process.env.POSTGRES_PRISMA_URL,
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.STORAGE_DATABASE_URL_UNPOOLED,
  // Some integrations add a duplicated prefix
  process.env.POSTGRES_POSTGRES_PRISMA_URL,
  process.env.POSTGRES_POSTGRES_URL_NON_POOLING,
];

const selected = candidates.find(Boolean);

if (!selected) {
  console.error(`db-init: No UNPOOLED Postgres URL found. Expected one of: ` +
    `DATABASE_URL_UNPOOLED, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, ` +
    `STORAGE_DATABASE_URL_UNPOOLED, POSTGRES_POSTGRES_PRISMA_URL, POSTGRES_POSTGRES_URL_NON_POOLING.`);
  process.exit(1);
}

// Point Prisma at the resolved UNPOOLED URL just for schema operations
process.env.DATABASE_URL = selected;

console.log('db-init: Using UNPOOLED DATABASE_URL for schema operations.');

try {
  // Run the existing prisma db push script in apps/web
  execSync('pnpm -C apps/web run db:push', { stdio: 'inherit' });
  console.log('db-init: prisma db push completed.');
} catch (err) {
  console.error('db-init: prisma db push failed.');
  process.exit(err?.status || 1);
}
