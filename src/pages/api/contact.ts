import type { APIRoute } from 'astro';
import { SITE } from '../../config/site';

/* The inquiry form's endpoint — the one route on the site that runs on demand
   (a Vercel function); everything else is static.

   Mail goes out through Resend's REST API, so no SDK is needed. Configure on
   Vercel → Settings → Environment Variables:
     RESEND_API_KEY   required
     CONTACT_TO       optional, defaults to SITE.email
     CONTACT_FROM     optional, must be a Resend-verified sender;
                      defaults to Resend's shared onboarding address
   Without a key the endpoint answers 500 `not_configured`, and the form shows
   its error with the phone and email — it never claims a message went out
   when none did. */
export const prerender = false;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: 'bad_request' });
  }

  const field = (key: string, max: number) => String(data[key] ?? '').trim().slice(0, max);

  // Honeypot: a bot filled the hidden field. Answer as if it worked.
  if (field('company', 200)) return json(200, { ok: true });

  const name = field('name', 200);
  const email = field('email', 200);
  const phone = field('phone', 60);
  const message = field('message', 5000);
  const locale = field('locale', 5);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(422, { error: 'invalid' });
  }

  const key = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!key) return json(500, { error: 'not_configured' });

  const to = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? SITE.email;
  const from = import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? `${SITE.name} <onboarding@resend.dev>`;

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Language', locale || '—'],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#858585">${k}</td><td>${escape(v)}</td></tr>`)
    .join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `${SITE.name} — inquiry from ${name}`,
      html: `<table>${rows}</table><p style="white-space:pre-wrap">${escape(message || '—')}</p>`,
    }),
  });

  if (!response.ok) return json(502, { error: 'send_failed' });
  return json(200, { ok: true });
};
