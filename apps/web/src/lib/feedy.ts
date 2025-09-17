import sanitizeHtml from "sanitize-html";
import slugify from "slugify";
import crypto from "node:crypto";

export function makeSlug(s: string) {
  return slugify(s, { lower: true, strict: true, locale: "ro" }).slice(0, 80);
}
export function cleanExcerpt(s?: string | null) {
  if (!s) return "";
  return sanitizeHtml(String(s), { allowedTags: [], allowedAttributes: {} }).trim().slice(0, 300);
}
export function hashIp(ip: string, ua?: string | null) {
  const salt = process.env.HASH_SALT || "bonusmax";
  return crypto.createHash("sha256").update(`${ip}|${ua || ""}|${salt}`).digest("hex");
}
