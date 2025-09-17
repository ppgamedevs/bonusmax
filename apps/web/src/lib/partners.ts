import crypto from "node:crypto";

export function hashIp(ip: string, ua?: string | null) {
  const salt = process.env.HASH_SALT || "bonusmax";
  return crypto.createHash("sha256").update(`${ip}|${ua || ""}|${salt}`).digest("hex");
}

// scor simplu: buget + țintă + licență + .ro
export function scoreLead(input: {
  monthlyBudget?: number | null;
  goal?: string;
  website?: string | null;
  onjnLicenseId?: string | null;
}) {
  let s = 0;
  const b = input.monthlyBudget || 0;
  if (b >= 25000) s += 40;
  else if (b >= 10000) s += 30;
  else if (b >= 5000) s += 20;
  else if (b >= 2000) s += 10;

  const g = (input.goal || "").toUpperCase();
  if (g === "SPONSORED") s += 10;
  if (g === "CPA") s += 5;

  if (input.onjnLicenseId && input.onjnLicenseId.trim().length >= 4) s += 15;

  const site = (input.website || "").toLowerCase();
  if (site.endsWith(".ro")) s += 5;

  return Math.min(100, s);
}

// anti-bot trivial: honeypot + captcha sum
export function verifyForm(honeypot?: string | null, a?: string | null, b?: string | null, c?: string | null) {
  if (honeypot && honeypot.trim() !== "") return false;
  const x = Number(a || 0) + Number(b || 0);
  return x === Number(c || -1);
}
