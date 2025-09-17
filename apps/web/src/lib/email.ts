import crypto from "node:crypto";
import { prisma, sendEmail, emailLayout, plain } from "@bonusmax/lib";
import { absoluteUrl } from "@bonusmax/lib/seo";

function sha256(s: string) {
  const salt = process.env.HASH_SALT || "bonusmax";
  return crypto.createHash("sha256").update(s + "|" + salt).digest("hex");
}
export function makeToken() { return crypto.randomBytes(32).toString("base64url"); }

export async function createOrRefreshPending(email: string) {
  const token = makeToken();
  const confirmTokenHash = sha256(token);
  const unsubToken = makeToken();
  const unsubscribeTokenHash = sha256(unsubToken);

  const up = await prisma.subscriber.upsert({
    where: { email },
    update: { status: "PENDING" as any, confirmTokenHash, unsubscribeTokenHash },
    create: { email, status: "PENDING" as any, confirmTokenHash, unsubscribeTokenHash, frequency: "WEEKLY" as any },
  });
  return { subscriber: up, token, unsubToken };
}

export async function sendConfirmEmail(to: string, rawToken: string, subscriberId: string) {
  const url = absoluteUrl(`/alerte-bonusuri/confirm?token=${encodeURIComponent(rawToken)}`);
  const htmlBody = `
    <p>Confirmă abonarea la <strong>alerte bonusuri</strong> Bonusmax.</p>
    <p><a href="${url}" style="display:inline-block;padding:10px 14px;border:1px solid #111;border-radius:8px;text-decoration:none">Confirmă abonarea</a></p>
    <p>Sau deschide: ${url}</p>
    <img src="${absoluteUrl(`/i/email/open?sid=${subscriberId}`)}" width="1" height="1" alt="" />
  `;
  const html = emailLayout("Confirmă abonarea", htmlBody).replace("__UNSUB__", "");
  await sendEmail({ to, subject: "Confirmă abonarea la alertele Bonusmax", html, text: plain(html) });
}

export async function sendWeeklyDigest(to: string, subscriberId: string, offers: Array<{id:string,title:string,operator:{name:string}}> ) {
  const items = offers.map(o => `<li><a href="${absoluteUrl(`/e/click?sid=${subscriberId}&oid=${o.id}`)}" rel="nofollow" style="text-decoration:none">${o.operator.name} — ${o.title}</a></li>`).join("");
  const htmlBody = `
    <p>Iată top oferte din această săptămână:</p>
    <ul>${items}</ul>
    <p>Vezi mai multe pe <a href="${absoluteUrl("/")}">Bonusmax</a>.</p>
    <img src="${absoluteUrl(`/i/email/open?sid=${subscriberId}`)}" width="1" height="1" alt="" />
  `;
  const html = emailLayout("Top bonusuri – Săptămâna aceasta", htmlBody).replace("__UNSUB__", "__UNSUB__");
  return { html, text: plain(html) };
}

export { sha256 };
