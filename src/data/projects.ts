// Replace these sample projects with your own work.
// The first project marked `featured: true` gets the large spot on the homepage.

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
    title: 'Ledgerline',
    summary: 'Invoicing and payments dashboard for small agencies.',
    problem:
      'Agencies were reconciling invoices across spreadsheets and three payment tools. Ledgerline pulls everything into one view with automatic reminders.',
    role: 'Sole engineer — data model, API, UI, and deployment.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    outcome: 'Cut time spent on monthly billing from two days to under an hour.',
    live: 'https://example.com',
    repo: 'https://github.com/your-username/ledgerline',
    featured: true,
  },
  {
    title: 'Trailhead API',
    summary: 'Public REST API serving trail conditions to 40k monthly users.',
    problem: 'Rebuilt a slow PHP service as a typed Node API with caching and rate limits.',
    role: 'Backend lead',
    stack: ['TypeScript', 'Fastify', 'Redis', 'Docker'],
    outcome: 'p95 response time dropped from 1.8s to 120ms.',
    repo: 'https://github.com/your-username/trailhead-api',
  },
  {
    title: 'Shiftboard',
    summary: 'Scheduling app for hourly teams, built mobile-first.',
    problem: 'Managers needed to publish and swap shifts from their phones without calls.',
    role: 'Full-stack, from design system to push notifications',
    stack: ['React', 'GraphQL', 'PostgreSQL', 'Firebase'],
    live: 'https://example.com',
  },
  {
    title: 'deploy-preview-bot',
    summary: 'Open-source GitHub Action that posts preview links and Lighthouse scores on every PR.',
    problem: 'Reviewers kept missing performance regressions until after release.',
    role: 'Author and maintainer',
    stack: ['GitHub Actions', 'Node.js', 'Lighthouse CI'],
    repo: 'https://github.com/your-username/deploy-preview-bot',
  },
];
