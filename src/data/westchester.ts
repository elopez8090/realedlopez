// Westchester County places, grouped by region. Used by the Westchester page
// and the structured data that tells Google which areas you serve.
// To add a dedicated page for a place later, give it a `page` slug.

export interface Place {
  name: string;
  kind: 'city' | 'town' | 'village' | 'hamlet';
  page?: string;
}

export interface Region {
  name: string;
  blurb: string;
  places: Place[];
}

export const home: Place = { name: 'Cortlandt Manor', kind: 'hamlet' };

export const regions: Region[] = [
  {
    name: 'Northern Westchester',
    blurb: 'My home base. I can meet in person anywhere from Peekskill and Croton to Yorktown, Somers, and Bedford.',
    places: [
      { name: 'Cortlandt Manor', kind: 'hamlet' },
      { name: 'Peekskill', kind: 'city' },
      { name: 'Cortlandt', kind: 'town' },
      { name: 'Croton-on-Hudson', kind: 'village' },
      { name: 'Buchanan', kind: 'village' },
      { name: 'Montrose', kind: 'hamlet' },
      { name: 'Verplanck', kind: 'hamlet' },
      { name: 'Yorktown', kind: 'town' },
      { name: 'Yorktown Heights', kind: 'hamlet' },
      { name: 'Mohegan Lake', kind: 'hamlet' },
      { name: 'Shrub Oak', kind: 'hamlet' },
      { name: 'Jefferson Valley', kind: 'hamlet' },
      { name: 'Crompond', kind: 'hamlet' },
      { name: 'Somers', kind: 'town' },
      { name: 'Ossining', kind: 'town' },
      { name: 'Briarcliff Manor', kind: 'village' },
      { name: 'New Castle', kind: 'town' },
      { name: 'Chappaqua', kind: 'hamlet' },
      { name: 'Mount Kisco', kind: 'town' },
      { name: 'Bedford', kind: 'town' },
      { name: 'Bedford Hills', kind: 'hamlet' },
      { name: 'Katonah', kind: 'hamlet' },
      { name: 'Lewisboro', kind: 'town' },
      { name: 'South Salem', kind: 'hamlet' },
      { name: 'Goldens Bridge', kind: 'hamlet' },
      { name: 'North Salem', kind: 'town' },
      { name: 'Croton Falls', kind: 'hamlet' },
      { name: 'Pound Ridge', kind: 'town' },
      { name: 'North Castle', kind: 'town' },
      { name: 'Armonk', kind: 'hamlet' },
    ],
  },
  {
    name: 'Central Westchester and the Rivertowns',
    blurb: 'From White Plains and Valhalla to the Hudson River villages of Tarrytown, Irvington, and Dobbs Ferry.',
    places: [
      { name: 'White Plains', kind: 'city' },
      { name: 'Greenburgh', kind: 'town' },
      { name: 'Hartsdale', kind: 'hamlet' },
      { name: 'Elmsford', kind: 'village' },
      { name: 'Ardsley', kind: 'village' },
      { name: 'Dobbs Ferry', kind: 'village' },
      { name: 'Hastings-on-Hudson', kind: 'village' },
      { name: 'Irvington', kind: 'village' },
      { name: 'Tarrytown', kind: 'village' },
      { name: 'Sleepy Hollow', kind: 'village' },
      { name: 'Mount Pleasant', kind: 'town' },
      { name: 'Pleasantville', kind: 'village' },
      { name: 'Thornwood', kind: 'hamlet' },
      { name: 'Hawthorne', kind: 'hamlet' },
      { name: 'Valhalla', kind: 'hamlet' },
      { name: 'Harrison', kind: 'town' },
      { name: 'Purchase', kind: 'hamlet' },
      { name: 'Scarsdale', kind: 'town' },
    ],
  },
  {
    name: 'Southern Westchester and the Sound Shore',
    blurb: 'Yonkers, Mount Vernon, and New Rochelle, plus the Long Island Sound communities from Pelham to Port Chester.',
    places: [
      { name: 'Yonkers', kind: 'city' },
      { name: 'Mount Vernon', kind: 'city' },
      { name: 'New Rochelle', kind: 'city' },
      { name: 'Rye', kind: 'city' },
      { name: 'Eastchester', kind: 'town' },
      { name: 'Bronxville', kind: 'village' },
      { name: 'Tuckahoe', kind: 'village' },
      { name: 'Pelham', kind: 'town' },
      { name: 'Pelham Manor', kind: 'village' },
      { name: 'Mamaroneck', kind: 'town' },
      { name: 'Larchmont', kind: 'village' },
      { name: 'Rye Brook', kind: 'village' },
      { name: 'Port Chester', kind: 'village' },
    ],
  },
];

export const allPlaces = regions.flatMap((r) => r.places);
