// "How I work": the steps you follow on every project, in order.
// Each step points to real work so visitors can see it in action.

export interface Step {
  title: string;
  detail: string;
}

export const intro =
  'I work independently and own every part of a product: the idea, the data, the code, the launch, and what happens after.';

export const steps: Step[] = [
  {
    title: 'Find a real problem',
    detail:
      'I start with a question people already search for, such as “Did hail hit my house?” or “Where are the Christian homeschool co-ops in my state?”, and build the most useful answer to it.',
  },
  {
    title: 'Get the data right',
    detail:
      'Most of my projects run on public datasets like NOAA storm reports and the Lahman Baseball Database. I clean, model, and verify the data before designing any page.',
  },
  {
    title: 'Build fast, focused sites',
    detail:
      'I use Astro for content and data sites and Next.js when a product needs accounts, submissions, or an admin dashboard. Pages load fast and work on any phone.',
  },
  {
    title: 'Launch for search and sharing',
    detail:
      'Every site ships with clean URLs, structured metadata, sitemaps, and pages generated for each state, county, or player, so people can find them from Google.',
  },
  {
    title: 'Keep it running',
    detail:
      'After launch I keep the data current, fix issues, and add features based on how people actually use the site.',
  },
];
