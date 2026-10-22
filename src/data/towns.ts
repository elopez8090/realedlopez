// Town pages. Each town has its own local copy, questions, and study numbers,
// so no two pages say the same thing. Add a town here, then add a page file
// in src/pages that renders <TownPage slug="..." />.

export interface Town {
  slug: string; // page address, e.g. web-design-peekskill
  name: string; // shown in headings
  statsKey: string; // key in townStats (the study area this page reports)
  title: string; // under 60 characters
  description: string; // under 155 characters
  h1: string;
  lede: string;
  local: { heading: string; body: string };
  faqs: { q: string; a: string }[];
  nearby: string[]; // slugs of other town pages to link
}

export const towns: Town[] = [
  {
    slug: 'web-design-cortlandt-manor',
    name: 'Cortlandt Manor',
    statsKey: 'Cortlandt',
    title: 'Web Design in Cortlandt Manor, NY | Eduardo Lopez',
    description: 'Web developer based in Cortlandt Manor. Fast, mobile-friendly websites for local businesses, with a free speed check of your current site.',
    h1: 'Web design in Cortlandt Manor, from a neighbor',
    lede: 'Cortlandt Manor is home. I build fast, mobile-friendly websites for businesses here and across the Town of Cortlandt, and I can meet you in person, usually the same week.',
    local: {
      heading: 'Working with Cortlandt businesses',
      body: 'Many businesses here are spread along Route 6 and Route 202 rather than on one main street, so customers usually find them by searching on their phones. That makes a fast site and an accurate Google Business Profile especially important. I help with both, and because I am local, we can sit down together to plan the site and check it on your own phone before launch.',
    },
    faqs: [
      { q: 'Are you actually based in Cortlandt Manor?', a: 'Yes. I live and work here, so meeting in person is easy anywhere in the Town of Cortlandt, including Montrose, Verplanck, Buchanan, and Croton-on-Hudson.' },
      { q: 'Can you help my business show up on Google Maps?', a: 'Yes. I set up or clean up your Google Business Profile so your hours, services, photos, and website link are correct, and I make sure your website matches it.' },
      { q: 'Can you check my current website for free?', a: 'Yes. Send me the address and I will run Google’s mobile speed test and reply with your score and the changes that would help most.' },
    ],
    nearby: ['web-design-peekskill', 'web-design-croton-on-hudson', 'web-design-yorktown'],
  },
  {
    slug: 'web-design-peekskill',
    name: 'Peekskill',
    statsKey: 'Peekskill',
    title: 'Web Design in Peekskill, NY | Eduardo Lopez',
    description: 'Web developer next door in Cortlandt Manor. I tested Peekskill business websites on phones: none met Google’s speed target. Free site check.',
    h1: 'Web design for Peekskill businesses',
    lede: 'I’m a web developer in Cortlandt Manor, right next door to Peekskill. I build fast, mobile-friendly websites for local restaurants, shops, and service businesses, and I can meet you downtown to plan yours.',
    local: {
      heading: 'Local, and easy to reach',
      body: 'I work with businesses across Peekskill, from the restaurants and shops around Main Street and Division Street to service businesses throughout the city. Downtown draws visitors from the Metro-North station and the waterfront, and most of them look you up on a phone first.',
    },
    faqs: [
      { q: 'Can you check my business website for free?', a: 'Yes. Send me your website address and I will run the same Google test used in this study, then send you the score and the two or three changes that would help most. There is no obligation.' },
      { q: 'Can we meet in Peekskill?', a: 'Yes. I live in neighboring Cortlandt Manor and am happy to meet at your business or a coffee place downtown.' },
      { q: 'My site is on Wix, Squarespace, or WordPress. Do I need to start over?', a: 'Not always. Some sites get much faster with a few fixes to images, fonts, and apps. If a rebuild makes more sense, I keep your page addresses so you do not lose the Google rankings you already have.' },
    ],
    nearby: ['web-design-cortlandt-manor', 'web-design-croton-on-hudson', 'web-design-yorktown'],
  },
  {
    slug: 'web-design-croton-on-hudson',
    name: 'Croton-on-Hudson',
    statsKey: 'Croton-on-Hudson',
    title: 'Web Design in Croton-on-Hudson, NY | Eduardo Lopez',
    description: 'Local web developer for Croton-on-Hudson businesses. I tested 22 Croton business websites on phones: none met Google’s speed target.',
    h1: 'Web design for Croton-on-Hudson businesses',
    lede: 'I’m a web developer in neighboring Cortlandt Manor. I build fast websites for Croton’s restaurants, shops, and service businesses, in both the Upper Village and Harmon.',
    local: {
      heading: 'Built for how Croton customers find you',
      body: 'Croton has two business districts, the Upper Village and Harmon, plus steady traffic from the Croton-Harmon train station and visitors heading to Croton Point Park. Restaurants and shops made up most of the Croton sites I tested, and those are exactly the businesses people look up on a phone right before they go.',
    },
    faqs: [
      { q: 'Do you work with businesses in both the Upper Village and Harmon?', a: 'Yes. I am a short drive away in Cortlandt Manor and can meet you at your business in either part of the village.' },
      { q: 'Can you make my menu or product list easy to update?', a: 'Yes. I can set up your site so you can change menus, hours, and specials yourself, without calling a developer for every update.' },
      { q: 'Can you check my current website for free?', a: 'Yes. Send me the address and I will reply with your mobile speed score and the changes that would help most.' },
    ],
    nearby: ['web-design-cortlandt-manor', 'web-design-ossining', 'web-design-peekskill'],
  },
  {
    slug: 'web-design-yorktown',
    name: 'Yorktown',
    statsKey: 'Yorktown',
    title: 'Web Design in Yorktown, NY | Eduardo Lopez',
    description: 'Web developer for Yorktown Heights, Mohegan Lake, Shrub Oak, and Jefferson Valley businesses. Fast, mobile-friendly sites and a free speed check.',
    h1: 'Web design for Yorktown businesses',
    lede: 'I build fast, mobile-friendly websites for businesses across Yorktown, including Yorktown Heights, Mohegan Lake, Shrub Oak, Jefferson Valley, and Crompond. I’m right next door in Cortlandt Manor.',
    local: {
      heading: 'One town, several business areas',
      body: 'Yorktown’s businesses are spread across several hamlets, from Yorktown Heights to the Route 6 corridor in Mohegan Lake and the area around Jefferson Valley Mall. Customers rarely search for “Yorktown” alone; they search for a hamlet or for something near them. I set up your site and Google profile so you show up for the places your customers actually type.',
    },
    faqs: [
      { q: 'Do you cover Mohegan Lake, Shrub Oak, and Jefferson Valley?', a: 'Yes. I work with businesses in every part of Yorktown, and Cortlandt Manor borders the town, so meeting in person is easy.' },
      { q: 'Can my website mention every hamlet I serve?', a: 'Yes. I set up your pages and Google Business Profile service area so customers searching in Yorktown Heights, Mohegan Lake, or Shrub Oak can all find you, without stuffing keywords that Google penalizes.' },
      { q: 'Can you check my current website for free?', a: 'Yes. Send me the address and I will reply with your mobile speed score and the changes that would help most.' },
    ],
    nearby: ['web-design-cortlandt-manor', 'web-design-peekskill', 'web-design-ossining'],
  },
  {
    slug: 'web-design-ossining',
    name: 'Ossining',
    statsKey: 'Ossining',
    title: 'Web Design in Ossining, NY | Eduardo Lopez',
    description: 'Local web developer for Ossining businesses, including bilingual English and Spanish websites. Fast, mobile-friendly sites and a free speed check.',
    h1: 'Web design for Ossining businesses',
    lede: 'I build fast, mobile-friendly websites for Ossining’s restaurants, shops, and service businesses, including bilingual English and Spanish sites. I’m a short drive away in Cortlandt Manor.',
    local: {
      heading: 'Websites that serve all of Ossining',
      body: 'Ossining’s downtown along Main Street mixes long-running family businesses with newer restaurants, and many serve customers in both English and Spanish. I have built a full bilingual site before, Latinos en Baseball, so I can give your customers a real Spanish version of your site, not an automatic translation.',
    },
    faqs: [
      { q: 'Can you build my website in English and Spanish?', a: 'Yes. I build bilingual sites with a proper Spanish version of every page and a language switch, so Google shows the right version to each customer.' },
      { q: 'Can we meet in Ossining?', a: 'Yes. I am a short drive away in Cortlandt Manor and can meet at your business or downtown.' },
      { q: 'Can you check my current website for free?', a: 'Yes. Send me the address and I will reply with your mobile speed score and the changes that would help most.' },
    ],
    nearby: ['web-design-croton-on-hudson', 'web-design-cortlandt-manor', 'web-design-yorktown'],
  },
];

export const townBySlug = (slug: string) => towns.find((t) => t.slug === slug)!;
