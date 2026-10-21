# realedlopez.com

Personal site for Ed Lopez, built with [Astro](https://astro.build). Static, fast, and free to host.

## Run it locally

You need Node.js 22 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs the finished site to dist/
npm run preview    # serves dist/ locally to check the build
```

## Make it yours

Everything personal is kept in a few small files, so you rarely need to touch the page code.

| What | Where |
| --- | --- |
| Name, headline, intro, email, social links, skills | `src/data/site.ts` |
| Projects (first `featured: true` gets the big spot) | `src/data/projects.ts` |
| Work history | `src/data/experience.ts` |
| Blog posts (one Markdown file each) | `src/content/blog/` |
| Résumé | add `public/resume.pdf` |
| Social share image | `public/og.png` (1200×630) |
| Favicon | `public/favicon.svg` |
| Colors and fonts | top of `src/styles/global.css` |

Checklist before going live:

- [ ] Replace the sample projects, jobs, and blog post with your real ones
- [ ] Update the GitHub and LinkedIn links in `site.ts`
- [ ] Add `public/resume.pdf`
- [ ] Make sure `eduardo@realedlopez.com` actually receives mail (see below)

### Writing a blog post

Create `src/content/blog/my-post.md`:

```md
---
title: My post title
description: One sentence for search results and the post list.
date: 2026-11-01
tags: [react, testing]
---

Your content here.
```

Set `draft: true` to hide a post until it's ready. The RSS feed and sitemap update automatically.

## Deploy and connect realedlopez.com

Any static host works. The simplest route is GitHub plus Vercel, Netlify, or Cloudflare Pages (all have free tiers and automatic HTTPS).

1. **Put the code on GitHub.** Create a new repository and push this folder to it.
2. **Import it into a host.** On Vercel, Netlify, or Cloudflare Pages, choose "Import project", pick the repository, and accept the detected Astro settings (build command `npm run build`, output folder `dist`).
3. **Add your domain.** In the host's project settings, add `realedlopez.com` and `www.realedlopez.com`.
4. **Update DNS at your registrar.** The host shows the exact records to add (usually an A or ALIAS record for `realedlopez.com` and a CNAME for `www`). Copy them into your registrar's DNS settings. Alternatively, switch your domain's nameservers to the host if it offers that.
5. **Wait for it to go live.** DNS changes usually take minutes, sometimes up to 48 hours. HTTPS is issued automatically once DNS resolves.

After that, every `git push` redeploys the site.

## Email at your domain

For `eduardo@realedlopez.com`, either:

- **Forward to your existing inbox for free** with Cloudflare Email Routing or ImprovMX, or
- **Get a full mailbox** with Google Workspace, Zoho Mail, or Fastmail.

## Project structure

```
src/
  components/   Header, Footer, Terminal (hero)
  content/blog/ Markdown posts
  data/         site.ts, projects.ts, experience.ts  ← edit these
  layouts/      Base.astro (SEO tags, fonts, layout)
  pages/        index, blog/, 404, rss.xml
  styles/       global.css (colors, type scale)
public/         favicon, og.png, robots.txt, resume.pdf
```
