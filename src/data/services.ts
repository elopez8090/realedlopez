// What you can hire Eduardo for. Edit freely: the Services page and the
// Westchester page both read from this file.

export interface Service {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  example?: { label: string; href: string };
}

export const services: Service[] = [
  {
    id: 'small-business-websites',
    title: 'Websites for small businesses',
    summary:
      'A fast, professional website that looks right on every phone, explains what you do in plain words, and is set up so Google can find it.',
    includes: [
      'Custom design that fits your business, not a template',
      'Mobile-first pages that load in about a second',
      'Search setup: page titles, descriptions, sitemap, and structured data',
      'Help setting up or improving your Google Business Profile',
      'Contact form or booking link, plus launch on your own domain',
    ],
  },
  {
    id: 'redesigns',
    title: 'Redesigns and speed fixes',
    summary:
      'If your current site is slow, dated, or hard to use on a phone, I can rebuild it or fix what is holding it back, while keeping the pages Google already knows.',
    includes: [
      'A free speed and mobile check of your current site',
      'A rebuild that keeps your existing page addresses and search rankings',
      'Clearer pages and calls to action',
      'Redirects and cleanup so nothing breaks at launch',
    ],
  },
  {
    id: 'directories-and-data',
    title: 'Directory and data-driven websites',
    summary:
      'Sites built on lists or data: business and program directories, local guides, lookup tools, maps, and stats sites with hundreds or thousands of pages.',
    includes: [
      'Listings with search, filters, and a page for every entry',
      'Submission forms and an admin review queue',
      'Maps and address lookups',
      'Automatic data updates',
    ],
    example: { label: 'See Hailstorm Report', href: 'https://hailstormreport.com/' },
  },
  {
    id: 'web-apps',
    title: 'Custom web apps',
    summary:
      'When a website needs accounts, forms, or a dashboard, I build it with Next.js so it stays fast and easy to grow.',
    includes: [
      'User accounts and sign-in',
      'Forms, submissions, and admin dashboards',
      'Connections to the tools you already use',
    ],
    example: { label: 'See Christian Homeschools Hub', href: 'https://www.christianhomeschoolshub.com/' },
  },
  {
    id: 'care',
    title: 'Ongoing care',
    summary:
      'After launch, I can handle updates, new pages, and fixes, so you can focus on running your business.',
    includes: ['Content and page updates', 'Uptime and speed checks', 'Search Console monitoring and fixes'],
  },
];

export const steps = [
  { title: 'Free call', detail: 'A 30-minute call, by phone, video, or in person in Westchester, to talk about your business and what the site needs to do.' },
  { title: 'Fixed quote', detail: 'I send a written plan with a fixed price and timeline. No hourly surprises.' },
  { title: 'Design and build', detail: 'You see the design early and give feedback before anything is final.' },
  { title: 'Launch', detail: 'I put the site live on your domain, connect Google Search Console, and check everything on real phones.' },
  { title: 'Support', detail: 'I stay available for changes, and offer ongoing care if you want it.' },
];

export const faqs = [
  {
    q: 'How much does a website cost?',
    a: 'It depends on how many pages and features you need. After a free call, I send a fixed price in writing, so you know the full cost before any work starts.',
  },
  {
    q: 'How long does it take?',
    a: 'Your quote includes a timeline. Small business sites are the fastest. Directories and web apps take longer because there is more to build and test.',
  },
  {
    q: 'Can we meet in person?',
    a: 'Yes. I am based in Cortlandt Manor and meet clients anywhere in Westchester County. I also work remotely with clients across the U.S.',
  },
  {
    q: 'Will my website show up on Google?',
    a: 'Every site launches with the technical setup Google needs to find and understand it. Rankings take time and depend on your competition, so I also help with your Google Business Profile and give you a plan for what to add over time.',
  },
  {
    q: 'Do I own my website?',
    a: 'Yes. Your domain, content, and website are yours.',
  },
];
