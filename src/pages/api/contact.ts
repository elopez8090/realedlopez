// Contact form handler. Runs on Vercel (not prerendered) and emails each message through Resend.
import type { APIRoute } from 'astro';
import { RESEND_API_KEY, CONTACT_TO } from 'astro:env/server';
import { site } from '../../data/site';
import { needs, budgets } from '../../data/contact';

export const prerender = false;

const MIN_SECONDS = 3; // bots submit instantly; people take longer than this
const clean = (v: FormDataEntryValue | null, max = 200) =>
  (typeof v === 'string' ? v : '').replace(/\r/g, '').trim().slice(0, max);
const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const reply = (status: number, message: string) =>
    wantsJson
      ? new Response(JSON.stringify({ ok: status < 400, message }), { status, headers: { 'content-type': 'application/json' } })
      : status < 400
        ? redirect('/contact/thanks/', 303)
        : new Response(message, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, 'Something went wrong reading the form. Please try again.');
  }

  // Spam checks: a hidden field people never fill in, and a minimum time on the page.
  // Bots get a normal "thanks" so they don't learn anything.
  const started = Number(form.get('started'));
  if (clean(form.get('company_website'))) return reply(200, 'Thanks!');
  if (!started || Date.now() - started < MIN_SECONDS * 1000) return reply(200, 'Thanks!');

  const name = clean(form.get('name'), 100);
  const email = clean(form.get('email'), 200);
  const phone = clean(form.get('phone'), 40);
  const business = clean(form.get('business'), 150);
  const website = clean(form.get('website'), 300);
  const needKey = clean(form.get('need'), 20);
  const need = needs[needKey] ?? needs.other;
  const budget = budgets.includes(clean(form.get('budget'), 40)) ? clean(form.get('budget'), 40) : 'Not given';
  const message = clean(form.get('message'), 5000);

  if (!name || !email || !message) return reply(400, 'Please fill in your name, email, and a short message.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, 'Please check your email address.');

  if (!RESEND_API_KEY) {
    console.error('Contact form: RESEND_API_KEY is not set');
    return reply(500, `The form isn't working right now. Please email me at ${site.email}.`);
  }

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Business', business || '—'],
    ['Website', website || '—'],
    ['Needs', need],
    ['Budget', budget],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`;
  const html = `<table cellpadding="4">${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(v)}</td></tr>`)
    .join('')}</table><p style="white-space:pre-wrap">${escape(message)}</p>`;

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `realedlopez.com <form@${site.domain}>`,
        to: [CONTACT_TO || site.email],
        reply_to: email,
        subject: `New inquiry: ${need} from ${name}${business ? `, ${business}` : ''}`,
        text,
        html,
      }),
    });
  } catch (err) {
    console.error('Contact form: could not reach Resend', err);
    return reply(502, `Your message didn't go through. Please email me at ${site.email}.`);
  }

  if (!res.ok) {
    console.error('Contact form: Resend error', res.status, await res.text());
    return reply(502, `Your message didn't go through. Please email me at ${site.email}.`);
  }
  return reply(200, 'Thanks! I’ll reply within two business days.');
};
