// Your projects. The first one marked `featured: true` gets the large spot on the homepage.

export interface Project {
  title: string;
  summary: string;
  problem: string;
  role: string;
  stack: string[];
  live?: string;
  repo?: string;
  outcome?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Hailstorm Report',
    summary: 'Free hail history lookup for any U.S. address, built on NOAA storm data.',
    problem:
      'Homeowners rarely know whether a storm actually hit their house before they call a roofer or file a claim. Enter an address and the site lists nearby NOAA hail reports with dates, sizes, and distances, a roof-inspection suggestion, and how many days are left in a typical claim window.',
    role: 'Solo project: designed and built the data pipeline, address search, and state, county, and storm pages.',
    stack: ['Astro', 'NOAA Storm Events data', 'Programmatic SEO'],
    outcome: '41,927 hail reports and 4,021 hail days since 2015, searchable across 5 states.',
    live: 'https://hailstormreport.com/',
    featured: true,
  },
  {
    title: 'Latinos en Baseball',
    summary: 'Bilingual stats and history site for every major leaguer born in Latin America.',
    problem:
      'Explore 2,488 players from 11 countries by country, hometown, and position, with all-time leaders, player comparisons, a “born on this day” feature, and long-form stories.',
    role: 'Solo project: designed and built the site, data model, and English/Spanish versions.',
    stack: ['Astro', 'i18n (EN/ES)', 'Lahman Baseball Database', 'Cloudflare'],
    outcome: '2,488 player profiles, 19 Hall of Famers, and the La Pizarra newsletter.',
    live: 'https://latinosenbaseball.com/en/',
  },
  {
    title: 'Christian Homeschools Hub',
    summary: 'Directory of Christ-centered homeschool programs, co-ops, and resources in all 50 states.',
    problem:
      'Helps Christian families find homeschool programs and co-ops near them, organized by state, with owner-verified listings and ESA eligibility details.',
    role: 'Solo project: designed and built the directory, listing submissions, and admin review.',
    stack: ['Next.js', 'Search', 'Admin dashboard'],
    live: 'https://www.christianhomeschoolshub.com/',
  },
];
