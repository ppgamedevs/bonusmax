import nodemailer from 'nodemailer';
import sg from '@sendgrid/mail';
import { absoluteUrl } from '../seo';

export type SendParams = { to: string; subject: string; html: string; text?: string };
const FROM = process.env.EMAIL_FROM || 'no-reply@example.com';

function hasSendgrid() {
  return !!process.env.SENDGRID_API_KEY;
}
function hasSmtp() {
  return !!process.env.SMTP_HOST;
}

let smtpTransport: nodemailer.Transporter | null = null;

async function getSmtp() {
  if (smtpTransport) return smtpTransport;
  smtpTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return smtpTransport;
}

export async function sendEmail({ to, subject, html, text }: SendParams) {
  if (hasSendgrid()) {
    sg.setApiKey(process.env.SENDGRID_API_KEY!);
    await sg.send({ to, from: FROM, subject, html, text });
    return true;
  }
  if (hasSmtp()) {
    const t = await getSmtp();
    await t.sendMail({ from: FROM, to, subject, html, text });
    return true;
  }
  console.warn('No email provider configured. Printing email to console.');
  console.log({ to, subject, html });
  return false;
}

export function emailLayout(title: string, bodyHtml: string) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
    <div style="font-size:12px;color:#666;text-transform:uppercase">Conținut comercial • 18+ Joacă responsabil</div>
    <h1 style="font-size:20px;margin:12px 0">${title}</h1>
    <div style="font-size:14px;line-height:1.6;color:#111">${bodyHtml}</div>
    <hr style="margin:24px 0;border:none;border-top:1px solid #eee" />
    <div style="font-size:12px;color:#666">
      Primești acest email pentru că te-ai abonat la alertele Bonusmax.
      <a href="${absoluteUrl('/alerte-bonusuri/unsubscribe')}?token=__UNSUB__">Dezabonare</a>
    </div>
  </div>`;
}

export function plain(html: string) {
  return html.replace(/<[^>]+>/g, '');
}
