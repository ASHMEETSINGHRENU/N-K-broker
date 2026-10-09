export interface DubaiProjectOption {
  name: string;
  developer?: string;
  location: string;
  startingPriceAED?: number;
}

export const DUBAI_PRIME_PROJECTS: DubaiProjectOption[] = [
  // Palm Jumeirah & Waterfront Iconics
  { name: 'Bulgari Lighthouse', developer: 'Meraas', location: 'Jumeira Bay Island' },
  { name: 'Atlantis The Royal Residences', developer: 'Kerzner International', location: 'Palm Jumeirah' },
  { name: 'Palm Flower by Foster + Partners', developer: 'Alpago Properties', location: 'Palm Jumeirah' },
  { name: 'Armani Beach Residences', developer: 'Arada', location: 'Palm Jumeirah' },
  { name: 'Como Residences', developer: 'Nakheel', location: 'Palm Jumeirah' },
  { name: 'Six Senses Residences Palm Jumeirah', developer: 'Select Group', location: 'Palm Jumeirah' },
  { name: 'AVA at Palm Jumeirah (Dorchester Collection)', developer: 'OMNIYAT', location: 'Palm Jumeirah' },
  { name: 'One at Palm Jumeirah', developer: 'OMNIYAT', location: 'Palm Jumeirah' },
  { name: 'Serenia Living', developer: 'Palma Holding', location: 'Palm Jumeirah' },
  { name: 'Ellington Ocean House', developer: 'Ellington Properties', location: 'Palm Jumeirah' },
  { name: 'Orla & Orla Infinity (Dorchester Collection)', developer: 'OMNIYAT', location: 'Palm Jumeirah' },
  { name: 'Palm Crown Signature Villas', developer: 'Nakheel', location: 'Palm Jumeirah' },
  { name: 'Nikki Beach Residences', developer: 'Meraas', location: 'Pearl Jumeira' },
  { name: 'Bluewaters Residences & Mansions', developer: 'Meraas', location: 'Bluewaters Island' },
  { name: 'Meraas Bluewaters Bay', developer: 'Meraas', location: 'Bluewaters Island' },
  { name: 'Marsa Al Arab Ultra-Luxury Villas', developer: 'Dubai Holding', location: 'Jumeirah' },
  { name: 'Jumeirah Asateer Residences', developer: 'Jumeirah Group', location: 'Umm Suqeim' },

  // Downtown, DIFC & Dubai Canal
  { name: 'Burj Binghatti Jacob & Co Residences', developer: 'Binghatti', location: 'Business Bay' },
  { name: 'Il Primo Penthouse Collection', developer: 'Emaar Properties', location: 'Downtown Dubai' },
  { name: 'The Lana Residences (Dorchester Collection)', developer: 'OMNIYAT', location: 'Marasi Bay' },
  { name: 'Baccarat Hotel & Residences', developer: 'Shamal Holding', location: 'Downtown Dubai' },
  { name: 'Bugatti Residences by Binghatti', developer: 'Binghatti', location: 'Business Bay' },
  { name: 'Binghatti Mercedes-Benz Places', developer: 'Binghatti', location: 'Downtown Dubai' },
  { name: 'One Za\'abeel The Residences', developer: 'ITHRA Dubai', location: 'Za\'abeel' },
  { name: 'Casa Canal Safa Park', developer: 'AHS Properties', location: 'Dubai Water Canal' },
  { name: 'Pagani Tower', developer: 'Dar Al Arkan', location: 'Downtown Dubai' },
  { name: 'Franck Muller Aeternitas Tower', developer: 'London Gate', location: 'Dubai Marina' },
  { name: 'Volante Business Bay', developer: 'Xtreme Homes', location: 'Business Bay' },
  { name: 'W Residences Downtown Dubai', developer: 'DarGlobal', location: 'Downtown Dubai' },
  { name: 'Address Beach Resort Residences', developer: 'Emaar Hospitality', location: 'JBR' },
  { name: 'Address Grand Creek Harbour', developer: 'Emaar Properties', location: 'Dubai Creek Harbour' },
  { name: 'OMNIYAT The Opus by Zaha Hadid', developer: 'OMNIYAT', location: 'Business Bay' },
  { name: 'OMNIYAT VELA & VELA Viento', developer: 'OMNIYAT', location: 'Marasi Bay' },
  { name: 'SLS Dubai Hotel & Residences', developer: 'WOW RED', location: 'Business Bay' },
  { name: 'Fairmont Residences Dubai Skyline', developer: 'RSG Group', location: 'Al Sufouh' },
  { name: 'Mandarin Oriental Residences Wasl Tower', developer: 'Wasl', location: 'Sheikh Zayed Road' },

  // Luxury Villa Enclaves & Golf Estates
  { name: 'Emirates Hills Signature Enclave', developer: 'Emaar Properties', location: 'Emirates Hills' },
  { name: 'Dubai Hills Estate Golf Place & Fairway Mansions', developer: 'Emaar Properties', location: 'Dubai Hills Estate' },
  { name: 'Tilal Al Ghaf Lanai Islands', developer: 'Majid Al Futtaim', location: 'Tilal Al Ghaf' },
  { name: 'Tilal Al Ghaf Serenity & Elysian Mansions', developer: 'Majid Al Futtaim', location: 'Tilal Al Ghaf' },
  { name: 'Al Barari Royal Bromelia & Dahlia Mansions', developer: 'Al Barari', location: 'Al Barari' },
  { name: 'District One West Mansions', developer: 'Meydan Group', location: 'MBR City' },
  { name: 'The Oasis by Emaar', developer: 'Emaar Properties', location: 'Dubailand' },
  { name: 'Jumeirah Golf Estates Sanctuary Mansions', developer: 'Jumeirah Golf Estates', location: 'JGE' },
  { name: 'Keturah Reserve Luxury Mansions', developer: 'MAG Group', location: 'Meydan' },
  { name: 'Nad Al Sheba Gardens Master Enclave', developer: 'Meraas', location: 'Nad Al Sheba' },
  { name: 'Cavalli Estates & Damac Hills Villas', developer: 'DAMAC Properties', location: 'Damac Hills' },
  { name: 'The Ritz-Carlton Creekside Mansions (Keturah Resort)', developer: 'MAG Group', location: 'Dubai Creek' },
  { name: 'Sobha Estates Hartland II Mansions', developer: 'Sobha Realty', location: 'Sobha Hartland II' },
  { name: 'Sobha Elwood Forest Villas', developer: 'Sobha Realty', location: 'Dubailand' },
  { name: 'Aldar Haven Luxury Eco Mansions', developer: 'Aldar Properties', location: 'Dubailand' },
  { name: 'Sobha Hartland Water Canal Villas', developer: 'Sobha Realty', location: 'MBR City' },
  { name: 'Ellington The Lakeshore', developer: 'Ellington Properties', location: 'MBR City' },

  // Mega Master Developments & Island Enclaves
  { name: 'Palm Jebel Ali The Crown Collection', developer: 'Nakheel', location: 'Palm Jebel Ali' },
  { name: 'Palm Jebel Ali Beach Collection Villas', developer: 'Nakheel', location: 'Palm Jebel Ali' },
  { name: 'Bay Villas Dubai Islands', developer: 'Nakheel', location: 'Dubai Islands' },
  { name: 'Wynn Al Marjan Island Luxury Residences', developer: 'Marjan', location: 'Al Marjan Island' },
  { name: 'Sobha Siniya Island Marine Reserve Villas', developer: 'Sobha Realty', location: 'Al Siniya Island' },
  { name: 'Sobha SeaHaven Sky Edition', developer: 'Sobha Realty', location: 'Dubai Harbour' },
  { name: 'Damac Bay & Damac Bay 2 by Cavalli', developer: 'DAMAC Properties', location: 'Dubai Harbour' },
  { name: 'Damac Riverside Crystal Lagoon Mansions', developer: 'DAMAC Properties', location: 'Damac Riverside' },
  { name: 'Damac Lagoons Monte Carlo & Venice', developer: 'DAMAC Properties', location: 'Damac Lagoons' },
  { name: 'Sobha Verde JLT', developer: 'Sobha Realty', location: 'Jumeirah Lake Towers' },
  { name: 'Sobha Waves Opulence & Sobha One', developer: 'Sobha Realty', location: 'Ras Al Khor' },
  { name: 'Meraas City Walk Northline & Central Park', developer: 'Meraas', location: 'City Walk' },
  { name: 'Emaar Beachfront Grand Bleu Tower (Elie Saab)', developer: 'Emaar Properties', location: 'Dubai Harbour' },
  { name: 'Emaar Beachfront Seapoint & Address Residences', developer: 'Emaar Properties', location: 'Dubai Harbour' },
  { name: 'Emaar South Fairway Villas & Golf Links', developer: 'Emaar Properties', location: 'Dubai South' },
  { name: 'Emaar The Valley Rivana & Alana Villas', developer: 'Emaar Properties', location: 'The Valley' },
  { name: 'Rixos Financial Centre Road Residences', developer: 'East & West Properties', location: 'Downtown Dubai' },
  { name: 'Keturah Downtown', developer: 'MAG Group', location: 'Downtown Dubai' },
  { name: 'Binghatti Ghost & Binghatti Hills', developer: 'Binghatti', location: 'Dubai Science Park' },
  { name: 'Ellington Claydon House', developer: 'Ellington Properties', location: 'MBR City' },
  { name: 'Damac Altitude de GRISOGONO', developer: 'DAMAC Properties', location: 'Business Bay' }
];

export const CRESTSHORE_RELATIONSHIP_MANAGERS = [
  {
    id: 'RM-TM-01',
    name: 'Tariq Al-Mansoor',
    role: 'Principal RM & Private Wealth Advisory',
    phone: '+971 4 821 4401',
    email: 'tariq.mansoor@crestshore.ae',
    avatar: 'TM'
  },
  {
    id: 'RM-ER-02',
    name: 'Elena Rostova',
    role: 'Ultra-Prime Acquisitions RM',
    phone: '+971 4 821 4402',
    email: 'elena.rostova@crestshore.ae',
    avatar: 'ER'
  },
  {
    id: 'RM-MV-03',
    name: 'Marcus Vance',
    role: 'Private Lending & Finance RM',
    phone: '+971 4 821 4403',
    email: 'marcus.vance@crestshore.ae',
    avatar: 'MV'
  },
  {
    id: 'RM-SH-04',
    name: 'Soraya Haddad',
    role: 'Property Care & Portfolio RM',
    phone: '+971 4 821 4404',
    email: 'soraya.haddad@crestshore.ae',
    avatar: 'SH'
  }
];

export const CRM_STATUSES = [
  'Hot',
  'Warm',
  'Cold',
  'Attempted',
  'Meeting Done',
  'Won',
  'Lost'
] as const;

export const PIPELINE_STAGES = CRM_STATUSES;

export const LEAD_SOURCES = [
  'Direct Client Mandate',
  'Private Family Office',
  'Chartered Accountant (CA) Advisory',
  'Wealth Manager / Private Bank',
  'Strategic Partner Network',
  'High-Net-Worth Peer Referral',
  'Off-Market Developer Allocation',
  'Existing Portfolio Client'
];

export const BUDGET_TIERS = [
  { label: 'AED 3M - 5M (Prime Entry)', value: 5000000 },
  { label: 'AED 5M - 10M (Prime Luxury)', value: 10000000 },
  { label: 'AED 10M - 25M (Super Prime)', value: 25000000 },
  { label: 'AED 25M - 50M (Ultra Prime)', value: 50000000 },
  { label: 'AED 50M - 100M (Bespoke Mansions)', value: 100000000 },
  { label: 'AED 100M+ (Trophy / Sovereign Asset)', value: 150000000 }
];
