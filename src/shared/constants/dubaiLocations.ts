export interface IDubaiCommunityMeta {
  name: string;
  slug: string;
  tagline: string;
  avgPricePerSqFt: number;
  highlightImage: string;
  description: string;
}

export const DUBAI_COMMUNITIES: IDubaiCommunityMeta[] = [
  {
    name: 'Palm Jumeirah',
    slug: 'palm-jumeirah',
    tagline: 'World-renowned archipelago offering beachfront super-mansions and waterfront penthouses',
    avgPricePerSqFt: 4850,
    highlightImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    description: 'The epitome of island luxury, featuring bespoke frond villas, branded residences, and private beaches.'
  },
  {
    name: 'Downtown Dubai',
    slug: 'downtown-dubai',
    tagline: 'The iconic heart of Dubai surrounding the majestic Burj Khalifa and Dubai Mall',
    avgPricePerSqFt: 3650,
    highlightImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=80',
    description: 'Center of cosmopolitan prestige with panoramic skyline penthouses, opera district residences, and urban sophistication.'
  },
  {
    name: 'Dubai Hills Estate',
    slug: 'dubai-hills-estate',
    tagline: 'The green heart of Dubai with championship 18-hole golf fairways and private parkland villas',
    avgPricePerSqFt: 2950,
    highlightImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    description: 'Master-planned luxury community offering championship golf courses, private clubhouse estates, and pristine green boulevards.'
  },
  {
    name: 'Emirates Hills',
    slug: 'emirates-hills',
    tagline: 'The Beverly Hills of Dubai, home to ultra-exclusive ambassadorial mansions',
    avgPricePerSqFt: 4200,
    highlightImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    description: 'Gated enclave of custom architectural masterworks overlooking Montgomerie Championship Golf Course.'
  },
  {
    name: 'Dubai Marina',
    slug: 'dubai-marina',
    tagline: 'Superyacht marina lifestyle framed by iconic high-rise architectural marvels',
    avgPricePerSqFt: 2750,
    highlightImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    description: 'Riviera-style waterfront living with promenade fine dining, private berths, and soaring duplex penthouses.'
  },
  {
    name: 'Jumeirah Bay Island',
    slug: 'jumeirah-bay-island',
    tagline: 'Ultra-prime seahorse-shaped island home to the Bulgari Resort & Private Mansions',
    avgPricePerSqFt: 7800,
    highlightImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    description: 'The pinnacle of private luxury in the Middle East, commanding historic price records for custom island mansions.'
  },
  {
    name: 'Dubai Creek Harbour',
    slug: 'dubai-creek-harbour',
    tagline: 'Next-generation waterfront city offering serene marina vistas and Ras Al Khor flamingo sanctuary',
    avgPricePerSqFt: 2400,
    highlightImage: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=80',
    description: 'Sustainable luxury combining historic creek tranquility with visionary high-rise waterfront architecture.'
  },
  {
    name: 'Business Bay',
    slug: 'business-bay',
    tagline: 'Dubai Canal waterfront enclave blending ultra-luxury residences with vibrant financial epicenters',
    avgPricePerSqFt: 2600,
    highlightImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80',
    description: 'Direct canal-facing architectural residences by Zaha Hadid, Foster + Partners, and Dorchester Collection.'
  }
];

export const DUBAI_DEVELOPERS = [
  { name: 'Emaar Properties', slug: 'emaar-properties', flagship: 'Downtown Dubai & Dubai Hills' },
  { name: 'Nakheel', slug: 'nakheel', flagship: 'Palm Jumeirah & Palm Jebel Ali' },
  { name: 'Omniyat', slug: 'omniyat', flagship: 'One at Palm Jumeirah & The Lana Residences' },
  { name: 'Meraas', slug: 'meraas', flagship: 'Bluewaters Island & Jumeirah Bay' },
  { name: 'Sobha Realty', slug: 'sobha-realty', flagship: 'Sobha Hartland' },
  { name: 'Ellington Properties', slug: 'ellington-properties', flagship: 'DT1 & Ocean House' },
  { name: 'DAMAC Properties', slug: 'damac-properties', flagship: 'Cavalli Couture & Safa Two' },
  { name: 'Select Group', slug: 'select-group', flagship: 'Six Senses Residences' }
];
