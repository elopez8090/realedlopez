// Your work history, newest first. Replace with your own.

export interface Job {
  period: string;
  title: string;
  company: string;
  detail: string;
}

export const experience: Job[] = [
  {
    period: '2023 — Now',
    title: 'Senior Software Engineer',
    company: 'Company Name',
    detail:
      'Lead engineer on the customer billing platform. Moved the monolith’s payments code into a separate service and set up the team’s CI/CD pipeline.',
  },
  {
    period: '2020 — 2023',
    title: 'Software Engineer',
    company: 'Company Name',
    detail:
      'Built React features and Node APIs for a SaaS product with 200k users. Introduced end-to-end tests that caught regressions before release.',
  },
  {
    period: '2018 — 2020',
    title: 'Junior Developer',
    company: 'Company Name',
    detail: 'Shipped client websites and internal tools; learned to own work from ticket to production.',
  },
];
