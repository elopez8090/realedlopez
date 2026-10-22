// ─────────────────────────────────────────────────────────────
//  Your personal details live here. Edit this file first.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Eduardo Lopez',
  domain: 'realedlopez.com',
  url: 'https://realedlopez.com',
  role: 'Full-stack software engineer',
  location: 'Cortlandt Manor, NY',
  // Shown in the browser tab and search results
  title: 'Eduardo Lopez | Web Developer in Westchester County, NY',
  description:
    'Eduardo Lopez is a web developer in Cortlandt Manor, NY, building fast, data-driven websites with Astro and Next.js for Westchester County businesses.',
  // Hero copy
  headline: 'I build web software that holds up in production.',
  intro:
    'Independent full-stack developer in Westchester County, NY. I build fast, data-driven websites with Astro and Next.js, from the first idea to launch and beyond.',
  available: true, // shows the "Open to new work" status in the hero
  email: 'eduardo@realedlopez.com',
  resume: '/resume.pdf', // drop your résumé at public/resume.pdf
  social: {
    github: 'https://github.com/elopez8090',
    linkedin: 'https://www.linkedin.com/in/realedlopez/',
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
