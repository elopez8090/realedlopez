---
title: How I cut an API's p95 latency from 1.8s to 120ms
description: A practical walkthrough of profiling, caching, and query fixes on a production Node.js service.
date: 2026-10-01
tags: [node, performance, postgres]
draft: true
---

This is a sample post. Replace it with your own writing, or delete this file once you publish your first article. Posts live in `src/content/blog/` as Markdown files.

## Start with measurement

Before changing anything, I added request tracing so every slow endpoint had a timeline. Two things stood out: an N+1 query on the list endpoint, and no caching for data that changed once an hour.

```ts
// Before: one query per trail
for (const trail of trails) {
  trail.conditions = await db.conditions.findLatest(trail.id);
}

// After: one query for all of them
const conditions = await db.conditions.findLatestFor(trails.map((t) => t.id));
```

## Cache what rarely changes

Trail conditions update hourly, so a Redis cache with a 5-minute TTL removed most database reads without serving stale data for long.

## Result

The p95 dropped to 120ms, and database CPU fell by about 70%. The bigger win was the tracing itself: the next regression was caught in a day.
