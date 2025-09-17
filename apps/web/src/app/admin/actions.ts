"use server";

import { revalidatePath } from "next/cache";
import { prisma, checkAffiliateLink, recordLinkCheck } from "@bonusmax/lib";
import { OperatorInputSchema, OfferInputSchema } from "@/lib/validators";
import { OfferType } from "@prisma/client";

function assertKey(k?: string | null) {
  if (!process.env.ADMIN_KEY) throw new Error("ADMIN_KEY not set");
  if (!k || k !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
}

function pathsToRevalidate(
  offer?: { id: string; operatorId: string } | null,
  operator?: { slug: string } | null
) {
  const paths = new Set<string>([
    "/",
    "/bonusuri-fara-depunere",
    "/rotiri-gratuite",
    "/sitemap.xml",
  ]);
  if (operator?.slug) paths.add(`/casino/${operator.slug}`);
  if (offer?.id) paths.add(`/bonus/${offer.id}`);
  return Array.from(paths);
}

// ---------- OPERATORS ----------
export async function createOperator(formData: FormData) {
  const data = Object.fromEntries(formData) as any;
  assertKey(data.key as string);
  const parsed = OperatorInputSchema.parse(data);

  const op = await prisma.operator.create({
    data: {
      slug: parsed.slug,
      name: parsed.name,
      isLicensedRO: !!parsed.isLicensedRO,
      logoUrl: parsed.logoUrl || null,
      website: parsed.website || null,
      rating: parsed.rating ?? 0,
      pros: parsed.pros ? parsed.pros.split("|").map((s) => s.trim()).filter(Boolean) : [],
      cons: parsed.cons ? parsed.cons.split("|").map((s) => s.trim()).filter(Boolean) : [],
    } as any,
  });

  for (const p of pathsToRevalidate(null, { slug: op.slug })) revalidatePath(p);
}

export async function updateOperator(formData: FormData) {
  const data = Object.fromEntries(formData) as any;
  assertKey(data.key as string);
  const parsed = OperatorInputSchema.parse(data);
  if (!parsed.id) throw new Error("id required");

  const op = await prisma.operator.update({
    where: { id: parsed.id },
    data: {
      slug: parsed.slug,
      name: parsed.name,
      isLicensedRO: !!parsed.isLicensedRO,
      logoUrl: parsed.logoUrl || null,
      website: parsed.website || null,
      rating: parsed.rating ?? 0,
      pros: parsed.pros ? parsed.pros.split("|").map((s) => s.trim()).filter(Boolean) : [],
      cons: parsed.cons ? parsed.cons.split("|").map((s) => s.trim()).filter(Boolean) : [],
    } as any,
  });

  for (const p of pathsToRevalidate(null, { slug: op.slug })) revalidatePath(p);
}

export async function deleteOperator(formData: FormData) {
  const data = Object.fromEntries(formData) as any;
  assertKey(data.key as string);
  const id = data.id as string;
  if (!id) throw new Error("id required");
  const op = await prisma.operator.delete({ where: { id } });
  for (const p of pathsToRevalidate(null, { slug: op.slug })) revalidatePath(p);
}

// ---------- OFFERS ----------
export async function createOffer(formData: FormData) {
  const data = Object.fromEntries(formData) as any;
  assertKey(data.key as string);
  const parsed = OfferInputSchema.parse(data);

  const offer = await prisma.offer.create({
    data: {
      operatorId: parsed.operatorId,
      title: parsed.title,
      offerType: parsed.offerType as OfferType,
      termsShort: parsed.termsShort,
      termsUrl: parsed.termsUrl || null,
      isActive: parsed.isActive ?? true,
      ctaBaseUrl: parsed.ctaBaseUrl,
      networkId: (data.networkId as string) || null,
      urlTemplate: (data.urlTemplate as string) || null,
      priority: parsed.priority ?? 100,
      country: parsed.country ?? "RO",
      startAt: parsed.startAt ? new Date(parsed.startAt) : null,
      endAt: parsed.endAt ? new Date(parsed.endAt) : null,
      wrMultiplier: Number.isFinite(parsed.wrMultiplier as any) ? parsed.wrMultiplier! : null,
      minDeposit: Number.isFinite(parsed.minDeposit as any) ? parsed.minDeposit! : null,
      maxCashout: Number.isFinite(parsed.maxCashout as any) ? parsed.maxCashout! : null,
    } as any,
  });

  const operator = await prisma.operator.findUnique({ where: { id: offer.operatorId } });
  for (const p of pathsToRevalidate({ id: offer.id, operatorId: offer.operatorId }, operator ? { slug: operator.slug } : null)) revalidatePath(p);
}

export async function updateOffer(formData: FormData) {
  const data = Object.fromEntries(formData) as any;
  assertKey(data.key as string);
  const parsed = OfferInputSchema.parse(data);
  if (!parsed.id) throw new Error("id required");

  const previous = await prisma.offer.findUnique({ where: { id: parsed.id } });
  const offer = await prisma.offer.update({
    where: { id: parsed.id },
    data: {
      operatorId: parsed.operatorId,
      title: parsed.title,
      offerType: parsed.offerType as OfferType,
      termsShort: parsed.termsShort,
      termsUrl: parsed.termsUrl || null,
      isActive: parsed.isActive ?? true,
      ctaBaseUrl: parsed.ctaBaseUrl,
      networkId: (data.networkId as string) || null,
      urlTemplate: (data.urlTemplate as string) || null,
      priority: parsed.priority ?? 100,
      country: parsed.country ?? "RO",
      startAt: parsed.startAt ? new Date(parsed.startAt) : null,
      endAt: parsed.endAt ? new Date(parsed.endAt) : null,
      wrMultiplier: Number.isFinite(parsed.wrMultiplier as any) ? parsed.wrMultiplier! : null,
      minDeposit: Number.isFinite(parsed.minDeposit as any) ? parsed.minDeposit! : null,
      maxCashout: Number.isFinite(parsed.maxCashout as any) ? parsed.maxCashout! : null,
    } as any,
  });

  const currOp = await prisma.operator.findUnique({ where: { id: offer.operatorId } });
  const prevOp = previous ? await prisma.operator.findUnique({ where: { id: previous.operatorId } }) : null;
  const slugs = new Set<string>();
  if (currOp?.slug) slugs.add(currOp.slug);
  if (prevOp?.slug) slugs.add(prevOp.slug);
  for (const slug of slugs) revalidatePath(`/casino/${slug}`);
  revalidatePath(`/bonus/${offer.id}`);
  revalidatePath("/");
  revalidatePath("/bonusuri-fara-depunere");
  revalidatePath("/rotiri-gratuite");
  revalidatePath("/sitemap.xml");
}

export async function deleteOffer(formData: FormData) {
  const data = Object.fromEntries(formData) as any;
  assertKey(data.key as string);
  const id = data.id as string;
  if (!id) throw new Error("id required");
  const offer = await prisma.offer.delete({ where: { id } });
  const operator = await prisma.operator.findUnique({ where: { id: offer.operatorId } });
  for (const p of pathsToRevalidate({ id: offer.id, operatorId: offer.operatorId }, operator ? { slug: operator.slug } : null)) revalidatePath(p);
}

export async function quickDisableOffer(formData: FormData) {
  const data = Object.fromEntries(formData) as any;
  assertKey(data.key as string);
  const id = data.id as string;
  if (!id) throw new Error("id required");
  const offer = await prisma.offer.update({ where: { id }, data: { isActive: false } });
  const operator = await prisma.operator.findUnique({ where: { id: offer.operatorId } });
  for (const p of pathsToRevalidate({ id: offer.id, operatorId: offer.operatorId }, operator ? { slug: operator.slug } : null)) revalidatePath(p);
}

export async function recheckOfferLink(formData: FormData) {
  const key = String(formData.get("key") || "");
  assertKey(key);
  const offerId = String(formData.get("offerId") || "");
  if (!offerId) throw new Error("offerId required");
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) throw new Error("not found");
  const r = await checkAffiliateLink(offer.ctaBaseUrl, 10000);
  await recordLinkCheck(offer.id, r);
  return { ok: true, result: r };
}
