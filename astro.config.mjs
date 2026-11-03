// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://realedlopez.com',
  trailingSlash: 'always',
  // Old town page addresses (renamed Nov 2026)
  redirects: {
    '/web-design-westchester/': '/web-developer-westchester/',
    '/web-design-peekskill/': '/web-developer-peekskill/',
    '/web-design-cortlandt-manor/': '/web-developer-cortlandt-manor/',
    '/web-design-croton-on-hudson/': '/web-developer-croton-on-hudson/',
    '/web-design-yorktown/': '/web-developer-yorktown/',
    '/web-design-ossining/': '/web-developer-ossining/',
  },
  // Pages stay static. Only routes that opt out of prerendering (the contact form API) run on Vercel.
  adapter: vercel(),
  integrations: [
    sitemap({ filter: (page) => !page.includes('/contact/thanks') }),
  ],
  env: {
    schema: {
      // Set these in Vercel: Project → Settings → Environment Variables
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed' },
  },
});
