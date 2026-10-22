// Per-town totals from scripts/label-towns.mjs (October 2026). Totals only, no business names.
// A town's own numbers are shown only when at least 8 of its sites were scored.

export interface TownStats {
  sitesFound: number;
  sitesScored: number;
  medianScore: number;
  poorScoreCount: number;
  goodScoreCount: number;
  medianLcpSeconds: number;
  metLcpTarget: number;
  lcpOver10s: number;
  brokenLinks: number;
}

export const townStats: Record<string, TownStats> = {
  Peekskill: { sitesFound: 10, sitesScored: 8, medianScore: 41.5, poorScoreCount: 5, goodScoreCount: 0, medianLcpSeconds: 12.4, metLcpTarget: 0, lcpOver10s: 4, brokenLinks: 2 },
  'Croton-on-Hudson': { sitesFound: 22, sitesScored: 20, medianScore: 60, poorScoreCount: 5, goodScoreCount: 1, medianLcpSeconds: 8.8, metLcpTarget: 0, lcpOver10s: 9, brokenLinks: 2 },
  Ossining: { sitesFound: 13, sitesScored: 10, medianScore: 56.5, poorScoreCount: 2, goodScoreCount: 0, medianLcpSeconds: 9, metLcpTarget: 1, lcpOver10s: 5, brokenLinks: 3 },
  Yorktown: { sitesFound: 9, sitesScored: 9, medianScore: 60, poorScoreCount: 1, goodScoreCount: 1, medianLcpSeconds: 8.2, metLcpTarget: 0, lcpOver10s: 4, brokenLinks: 0 },
  Cortlandt: { sitesFound: 7, sitesScored: 6, medianScore: 55, poorScoreCount: 2, goodScoreCount: 0, medianLcpSeconds: 13.8, metLcpTarget: 0, lcpOver10s: 4, brokenLinks: 1 },
};

export const MIN_SCORED = 8;
