---
title: Where Latin America's big leaguers come from, and why mapping it was harder than it looked
seoTitle: "Mapping where Latin America's MLB players come from"
description: How I matched 2,442 birthplaces to real coordinates for the Latinos en Baseball hometown maps, what the data shows, and the messy problems behind it.
date: 2026-10-21
tags: [data, python, astro, baseball]
draft: false
---

[Latinos en Baseball](https://latinosenbaseball.com/en/) covers every major leaguer born in Latin America: 2,488 players from 11 countries. One of my favorite features is the hometown map. Every birthplace gets a dot, and every town gets a page listing the players it produced.

The numbers behind that map tell a great story. Getting them right was one of the hardest parts of the project.

## Big-league talent comes from a few places

Of the 2,488 players, 2,442 have a known birth city. They come from **486 hometowns**, but the talent is far from evenly spread.

The ten biggest hometowns account for **35% of all players**:

| Hometown | Country | Major leaguers |
| --- | --- | --- |
| Santo Domingo | Dominican Republic | 221 |
| Havana | Cuba | 181 |
| San Pedro de Macorís | Dominican Republic | 109 |
| Caracas | Venezuela | 73 |
| Santiago de los Caballeros | Dominican Republic | 69 |
| San Cristóbal | Dominican Republic | 51 |
| Maracay | Venezuela | 46 |
| Maracaibo | Venezuela | 41 |
| Valencia | Venezuela | 38 |
| Río Piedras | Puerto Rico | 36 |

At the other end, **half of all hometowns (243) have produced exactly one major leaguer.** For those towns, one player is the whole story.

A few things stand out:

- **Santo Domingo and Havana are big capitals,** so their totals make sense. San Pedro de Macorís is not. It's a mid-sized sugar-mill city that produced 109 players, including Sammy Sosa, Robinson Canó, and Alfonso Soriano. The site has [a full story on it](https://latinosenbaseball.com/en/stories/san-pedro-de-macoris-big-league-pipeline/).
- **Maracay is a recent pipeline.** Its first major leaguer debuted in 1990. It has produced 46 since then, including Miguel Cabrera and Bobby Abreu.
- **The Dominican Republic and Venezuela dominate the map.** They account for 126 and 103 hometowns, compared with 67 for Mexico, a much larger country.

## Problem 1: Birthplaces aren't coordinates

The site is built on the SABR Lahman Baseball Database, the standard free source for baseball history. Lahman records where each player was born as text: a city, a state or province, and a country. To draw a map, I needed latitude and longitude.

My Python pipeline matches each birthplace against GeoNames, a free database of every city with at least 1,000 people. A simple name match fails constantly, because the same place is spelled many ways. "Mayagüez" might appear as "Mayaguez," with or without the accent. So before comparing names, I convert them to a plain key with no accents, punctuation, or extra spaces:

```python
def nkey(s):
    """Accent- and punctuation-insensitive key for matching place names."""
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s)).strip()
```

On the site, though, I always show the accented spelling. When a town appears both ways, the pipeline picks the version with accents.

## Problem 2: Official names don't match what people say

Many Latin American cities have a long official name and a short everyday one. Players are recorded as born in "Santiago," but GeoNames lists "Santiago de los Caballeros." "Higüey" is officially "Salvaleón de Higüey," and "La Vega" is "Concepción de La Vega."

For these, I keep a small hand-edited file of hometown aliases, about 40 rows. Each row maps a recorded name to the right GeoNames entry, or gives exact coordinates when no match exists. That file is also where editorial decisions live. For example, Río Piedras and Santurce are districts of San Juan, Puerto Rico, but generations of players list them as hometowns, so they keep their own pages.

## Problem 3: Some records point to the wrong country

This was the most surprising part. A few players are recorded in the wrong country entirely:

- **Johnny Sain**, the Braves pitcher, appears as born in Havana, Cuba. He was actually born in **Havana, Arkansas**.
- **Fred Beck** has the same issue: he was born in Havana, Illinois.
- **Rod Carew** was born in the former Panama Canal Zone, which Lahman records as part of the U.S. He's Panamanian, and the site counts him that way.
- **Jeter Downs** was born in San Andrés, Colombia, but appears with a U.S. birthplace.

Each fix goes into a country overrides file, along with the reason and a source link. If anyone asks why a player is or isn't counted, the answer is written down.

## Problem 4: Knowing what you don't know

Not everything matches automatically. Right now, 103 of the 486 hometowns have no coordinates, mostly small towns or historical names. A wrong pin is worse than a missing one, so those towns still get pages but no dot on the map.

Every time the pipeline runs, it writes a review list of unmatched towns, plus a list of early players whose birthplaces are uncertain. Fixing the map means working through that list one alias at a time.

## How it fits together

1. **A Python pipeline** reads the Lahman data, applies the curated files (country overrides, aliases, Spanish accents for names, nicknames), runs validation checks, and writes JSON.
2. **Astro** turns that JSON into the site: player profiles, country hubs, leaderboards, and the hometown pages, all in English and Spanish.
3. **Editorial changes never touch code.** Fixing a hometown means editing one CSV row and rerunning the pipeline.

## What I took away from it

- **Public data is a starting point, not a finished product.** Lahman is excellent, but a few wrong birthplaces would have put Arkansas pitchers on a map of Cuba.
- **Keep editorial decisions in plain files.** A CSV with a "reason" column is easy to review, easy to fix, and easy to explain.
- **Flag gaps instead of guessing.** A review list of unmatched towns is more honest than a confidently wrong map.

Explore the hometowns at [latinosenbaseball.com](https://latinosenbaseball.com/en/). If your town is missing a pin, [email me](mailto:eduardo@realedlopez.com).
