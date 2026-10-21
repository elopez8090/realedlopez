---
title: How I turned 42,000 NOAA hail reports into a free address lookup
seoTitle: "Turning 42,000 NOAA hail reports into an address lookup"
description: The data pipeline, address search, and daily updates behind Hailstorm Report, a static Astro site that tells homeowners whether hail hit near their house.
date: 2026-10-21
tags: [astro, data, noaa, cloudflare]
draft: false
---

After a big storm, homeowners ask one question: *did hail actually hit my house?* Roofers knock on doors saying yes. Insurance companies want proof. The answer already exists in public NOAA records, but those records are spread across bulk CSV files and daily reports that most people will never open.

So I built [Hailstorm Report](https://hailstormreport.com/). You type an address and get a plain-English answer: the hail reported nearby, how big it was, how far away, and how many days are left in a typical claim window. It covers Texas, Oklahoma, Kansas, Nebraska, and Colorado, with about 42,000 hail reports since 2015.

Here's how it works under the hood.

## Two NOAA sources, one timeline

NOAA publishes hail data in two places, and neither one is enough on its own.

- **The Storm Events Database** is the official record. It's carefully reviewed, but it runs months behind. As I write this, it's complete only through June 25, 2026.
- **Storm Prediction Center (SPC) daily reports** are preliminary. They show up the next day, but they're less polished and get revised for a few days afterward.

A homeowner checking last week's storm needs the fast data. Someone checking a storm from 2019 deserves the official data. I use both.

Two scripts download them:

- `fetch-history` downloads Storm Events' yearly bulk files (gzipped CSVs) and keeps only hail reports in the states I cover. It saves one small JSON file per year and skips any year whose source file hasn't changed.
- `fetch-recent` downloads SPC's daily hail CSV for each day after the official data ends. Because SPC revises recent reports, it always re-downloads the last few days.

Both scripts wait a second between requests and send a User-Agent with a contact email. NOAA asks automated downloaders to identify themselves, and being polite costs nothing.

## Cleaning the data into one shape

The two sources disagree on almost everything. Storm Events gives hail size in inches, local time zones, and its own state names. SPC gives size in hundredths of an inch ("175" means 1.75"), times in UTC, and comment fields that can contain commas.

Both parsers convert every report into the same small record:

```js
// { d: date, t: time, tz: time zone, s: size in inches, la: lat, lo: lon,
//   p: place, c: county, st: state, src: "NWS" or "SPC", id }
```

Place names need work too. NOAA writes locations like `3 N PLANO`, meaning three miles north of Plano. A small function strips the distance and fixes the capitalization:

```js
// "3 N PLANO" -> "Plano", "FORT WORTH" -> "Fort Worth"
const noDistance = raw.trim().replace(/^\d+(\.\d+)?\s+[NSEW]{1,3}\s+/i, '');
```

## Merging without double counting

The trickiest rule is how the two sources fit together. If I simply combined them, storms from the overlap period would be counted twice.

The build step works out, for each state, the last date covered by official data. It keeps every official report, then adds SPC reports **only for dates after that state's official cutoff**. Each state gets its own cutoff, so a state with older official data can't hide another state's recent storms.

The same build step writes everything the website needs:

- one compact file per state for the address lookup
- one record per storm day and state (about 4,000 of them), which become storm pages
- one record per town with enough reports, which become about 1,350 town pages
- a small `meta.json` with the "last updated" dates shown on the site

## Finding the address

Address search uses two free geocoders. The **US Census Geocoder** goes first because it's official and very accurate for full street addresses. If it can't find a match, which happens with ZIP codes and city names, the site falls back to **OpenStreetMap's Nominatim**.

Geocoding runs in a small Cloudflare Pages Function at `/api/geocode`, so the browser never calls those services directly. Successful results are cached for a day. The response also says whether the match is an exact address or an approximate area, and the results page tells the visitor which one they got.

## The distance math runs in your browser

There's no database server. Once the site knows the address and state, the browser downloads that state's hail file and does the search itself. To keep downloads small, each report is stored as a plain array instead of an object with repeated field names. Texas, the largest state, is about 1 MB on disk and about 235 KB compressed.

To find nearby reports, the site measures the distance from the address to every report in the state using the haversine formula, which calculates distance on a sphere:

```js
export function milesBetween(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
```

Checking about 15,000 Texas reports takes a fraction of a second, so no spatial index is needed yet.

The results are grouped into one row per storm day, showing the largest hail and the closest report. The headline picks the most recent day with hail of 1 inch or larger, then translates the size into something people recognize: 1.75" becomes "golf ball," and 2.75" becomes "baseball."

## Writing answers people can use

The data is the easy part. The words take more care.

Hailstorm Report never says a roof was damaged. A hail report shows where hail was *observed*, not what happened at a specific house. So the site gives general guidance based on size: under 1 inch rarely damages roofs, 1 inch and up can, and 1.75 inches and up usually justifies an inspection.

Then it shows the claim window: roughly how many days are left before a typical one-year reporting deadline, with a reminder to check the actual policy. Every results page can also be printed as a one-page summary, which is useful for a call with an insurance adjuster.

## Updating every day for free

The site is fully static, built with Astro and hosted on Cloudflare Pages. It stays current through a GitHub Actions workflow:

1. Every morning, GitHub runs the SPC download on its own servers.
2. On the 3rd of each month, it also refreshes the official Storm Events history.
3. If anything changed, it commits the new data to the repository.
4. That commit triggers Cloudflare Pages to rebuild and publish the site.

No server to maintain, no database to back up, and the hosting is free.

## What I'd tell someone building something similar

- **Start with the question, not the dataset.** "Did hail hit my house?" decided every feature, from the 5-mile default radius to the printable summary.
- **Combine fast data with official data.** Preliminary reports make the site useful this week, and official records make it trustworthy for past storms.
- **Static plus a little browser code goes a long way.** About 42,000 records fit in files a phone can download, and the search runs instantly without a server.
- **Be honest about what the data means.** A clear "this is not proof of damage" note builds more trust than an overconfident answer.

Try it at [hailstormreport.com](https://hailstormreport.com/). If you're working with NOAA data or building something similar, [email me](mailto:eduardo@realedlopez.com). I'm happy to compare notes.
