import { z } from "zod";

export const OfferSchema = z.object({
  id: z.string(),
  operatorId: z.string(),
  title: z.string().min(5),
  termsShort: z.string().min(10),
  offerType: z.string(),
  ctaBaseUrl: z.string().url(),
  isActive: z.boolean(),
  country: z.string().default("RO"),
  priority: z.number().int().nonnegative(),
  wrMultiplier: z.number().int().positive().max(200).nullable().optional(),
  minDeposit: z.number().int().nonnegative().nullable().optional(),
  maxCashout: z.number().int().nonnegative().nullable().optional(),
  startAt: z.coerce.date().nullable().optional(),
  endAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  operator: z.object({
    id: z.string(),
    name: z.string(),
    isLicensedRO: z.boolean(),
  }),
});

export const GuideSchema = z.object({
  slug: z.string(),
  title: z.string(),
  source: z.string(),
});

export type OfferDTO = z.infer<typeof OfferSchema>;
export type GuideDTO = z.infer<typeof GuideSchema>;
