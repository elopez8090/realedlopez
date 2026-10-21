---
title: What I check before launching a website
description: The checklist behind Hailstorm Report, Latinos en Baseball, and this portfolio, from search titles and sitemaps to phone screens, data checks, and honest disclaimers.
date: 2026-10-21
tags: [launch, seo, astro, checklist]
draft: false
---

Building the site is the fun part. The last 10% before launch decides whether anyone finds it, trusts it, and can use it on their phone.

Every site I ship goes through the same checklist. Here it is, with real examples from [Hailstorm Report](https://hailstormreport.com/), [Latinos en Baseball](https://latinosenbaseball.com/en/), and this portfolio.

## 1. Search engines can find and read every page

- **A sitemap and robots.txt.** Astro's sitemap integration lists every page automatically, and robots.txt points search engines to it. On a site with thousands of generated pages, like Hailstorm Report's storm and town pages, this is how Google discovers them.
- **A canonical URL on every page,** so the same page isn't indexed twice under slightly different addresses.
- **Titles and descriptions that fit.** Google cuts off long titles in search results. On Hailstorm Report, the code that writes page titles tries shorter versions until the title fits within 60 characters, and keeps descriptions within 155. Automated tests check it, so a new page type can't quietly break the rule.
- **Language tags on bilingual sites.** Every page on Latinos en Baseball tells search engines where its English and Spanish versions live, so Spanish-speaking fans land on the Spanish page.

## 2. Links look good when shared

When someone posts your link on LinkedIn, X, or a group chat, the preview card is the first impression. Every page gets:

- an Open Graph title and description
- a 1200×630 preview image, with alt text
- the site's name

Check this before launch, because social networks save previews. If someone shares the link early, the wrong preview can stick around for days.

## 3. It works on a real phone

Most visitors arrive on a phone, often from a search result or a shared link. I check:

- **The smallest common screens.** I test this portfolio at 333 and 375 pixels wide, and nothing may scroll sideways.
- **Tap targets.** Buttons are big enough to hit with a thumb, and the main menu stays short on small screens.
- **Readable text.** Body text stays at a comfortable size, and long tables fit or scroll on their own instead of breaking the page.

## 4. It's fast without trying hard

Static sites are fast by default. Most of the remaining work is images:

- **Compress and resize images at build time.** Astro converts images to modern formats automatically. My portrait went from 41 KB to 3 KB, and my logo from 16 KB to 5 KB.
- **Load only what each page needs.** Hailstorm Report's address lookup downloads just one state's hail file, about 235 KB compressed for Texas, and only when someone searches.

## 5. The data is checked, not assumed

For data-driven sites, wrong numbers are the most damaging bug, because visitors can't spot them.

- **Validate the data during every build.** The Latinos en Baseball pipeline has a check mode that stops the build if something doesn't add up. For example, the country totals must add up to the overall player count, and every player page URL must be unique.
- **Test the logic that turns data into words.** Hailstorm Report has 58 automated tests covering how reports are parsed, how towns are grouped, how links are chosen, and how titles are written.
- **Show when the data was last updated.** Both sites say how current their data is, so visitors know what they're looking at.

## 6. It's honest about what it is

Trust is part of the product, especially when real decisions depend on the information.

- **Say what the data can't tell you.** Hailstorm Report explains that a hail report shows where hail was observed, not proof that a specific roof was damaged.
- **Credit your sources.** NOAA for hail data, the SABR Lahman Baseball Database (CC BY-SA 3.0) for baseball stats, and GeoNames for coordinates.
- **Explain your methods.** Latinos en Baseball has a methodology page explaining who counts as a Latin American player and why.
- **Be clear about affiliation.** Latinos en Baseball says it isn't affiliated with Major League Baseball or any team.
- **Include the basics:** a privacy policy and, where needed, terms of use.

## 7. The details people notice

- **A real 404 page** that helps people find their way back, instead of a dead end.
- **A favicon,** so the site is recognizable in a crowded row of browser tabs.
- **Print styles where printing matters.** Hailstorm Report's address results print as a one-page summary for an insurance call. The interactive map doesn't print well, so it's hidden on paper.
- **Keyboard focus and reduced motion.** Every link shows a visible outline when you tab to it, and animations turn off for people who've asked their device to reduce motion.
- **No placeholders left behind.** Search the whole project for "lorem," "example.com," and "your-username" before launch. They are easy to miss.

## 8. It keeps working after launch

- **Automate updates.** Hailstorm Report refreshes its data every morning with a scheduled GitHub Action, and every change redeploys the site automatically.
- **Recheck after big changes.** A redesign or a new page type gets the same run through this list.

None of these steps is hard on its own. The value comes from doing all of them, every time.

If you're about to launch something and want a second pair of eyes, [email me](mailto:eduardo@realedlopez.com).
