import { z } from 'zod';

export const OperatorInputSchema = z.object({
  key: z.string().min(1),
  id: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  isLicensedRO: z.coerce.boolean().optional().default(false),
  logoUrl: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  pros: z.string().optional().default(''),
  cons: z.string().optional().default(''),
});

export const OfferInputSchema = z.object({
  key: z.string().min(1),
  id: z.string().optional(),
  operatorId: z.string().min(1),
  title: z.string().min(3),
  offerType: z.enum(['CASINO', 'PARIURI', 'ROTIRI', 'FARA_DEPUNERE']),
  termsShort: z.string().min(3),
  termsUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.coerce.boolean().optional().default(true),
  ctaBaseUrl: z.string().url().min(10),
  priority: z.coerce.number().int().min(0).max(9999).default(100),
  country: z.string().default('RO'),
  startAt: z.string().optional().or(z.literal('')),
  endAt: z.string().optional().or(z.literal('')),
  wrMultiplier: z.coerce.number().int().min(1).max(200).optional().or(z.nan()).nullable(),
  minDeposit: z.coerce.number().int().min(0).max(100000).optional().or(z.nan()).nullable(),
  maxCashout: z.coerce.number().int().min(0).max(1000000).optional().or(z.nan()).nullable(),
});

export type OperatorInput = z.infer<typeof OperatorInputSchema>;
export type OfferInput = z.infer<typeof OfferInputSchema>;
