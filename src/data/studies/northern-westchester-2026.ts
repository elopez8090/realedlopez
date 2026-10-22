// Totals from scripts/site-audit.mjs, run October 21, 2026.
// Aggregates only. The per-business results stay private in research/ (not committed).

export const study = {
  name: 'Northern Westchester small-business website study',
  testedOn: 'October 2026',
  area: 'Peekskill, Cortlandt (including Cortlandt Manor, Croton-on-Hudson, Buchanan, and Montrose), Yorktown, and Ossining',
  sitesFound: 63,
  sitesScored: 55,
  noResponse: 6,
  pageNotFound: 2,
  medianScore: 56,
  goodScoreCount: 2, // 90-100, Google's "good" range
  poorScoreCount: 16, // 0-49, Google's "poor" range
  metLcpTarget: 1, // main content visible within 2.5 seconds
  lcpOver10s: 28,
  medianLcpSeconds: 10.3,
  layoutShiftPct: 25,
  noMobileViewport: 5,
  byCategory: [
    { name: 'Restaurants, cafes, and bars', scored: 26, median: 57, medianLcp: 12.8 },
    { name: 'Shops and retail', scored: 10, median: 50.5, medianLcp: 16.1 },
    { name: 'Professional and home services', scored: 10, median: 67.5, medianLcp: 5.5 },
    { name: 'Health and veterinary', scored: 5, median: 53, medianLcp: 13.3 },
    { name: 'Arts, leisure, and lodging', scored: 4, median: 47.5, medianLcp: 14 },
  ],
};
