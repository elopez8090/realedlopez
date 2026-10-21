// ─────────────────────────────────────────────────────────────
//  Your personal details live here. Edit this file first.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Ed Lopez',
  domain: 'realedlopez.com',
  url: 'https://realedlopez.com',
  role: 'Full-stack software engineer',
  location: 'New York, USA',
  // Shown in the browser tab and search results
  title: 'Ed Lopez — Full-stack software engineer',
  description:
    'Ed Lopez is a full-stack software engineer who designs, builds, and ships reliable web applications with TypeScript, Node.js, React, and the cloud.',
  // Hero copy
  headline: 'I build web software that holds up in production.',
  intro:
    'Full-stack engineer working across React, Node.js, Postgres, and cloud infrastructure. I take products from a rough idea to a fast, tested, well-monitored release.',
  available: true, // shows the "Open to new work" status in the hero
  email: 'hello@realedlopez.com',
  resume: '/resume.pdf', // drop your résumé at public/resume.pdf
  social: {
    github: 'https://github.com/elopez8090',
    linkedin: 'https://www.linkedin.com/in/your-username',
  },
};

// Lines printed in the hero terminal
export const terminal = {
  stack: ['TypeScript', 'Astro', 'Next.js', 'React', 'Node.js'],
  focus: 'APIs, product UI, cloud deploys',
};

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML & CSS', 'SQL'] },
  { group: 'Frameworks', items: ['Astro', 'Next.js', 'React', 'Node.js'] },
  { group: 'Data', items: ['Public datasets', 'Data cleaning', 'Search', 'i18n (EN/ES)'] },
  { group: 'Shipping', items: ['Cloudflare', 'Vercel', 'Git & GitHub', 'SEO & metadata'] },
];
