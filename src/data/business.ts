// Structured data describing Eduardo's web development service, for Google.
import { site } from './site';
import { allPlaces } from './westchester';

export function businessSchema(pageUrl: string) {
  return {
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#business`,
    name: `${site.name}, Web Development`,
    url: `${site.url}/services/`,
    description:
      'Web design and development for small businesses and organizations in Westchester County, NY: fast websites, redesigns, directories, and custom web apps.',
    founder: { '@id': `${site.url}/#person` },
    email: site.email,
    image: `${site.url}/og.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cortlandt Manor',
      addressRegion: 'NY',
      postalCode: '10567',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Westchester County, NY' },
      ...allPlaces.map((p) => ({ '@type': 'Place', name: `${p.name}, NY` })),
    ],
    mainEntityOfPage: pageUrl,
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
