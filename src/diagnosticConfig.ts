export interface SoilProfile {
  id: string;
  name: string;
  designedFor: string;
  description: string;
  characteristics: string;
  warningText?: string;
  wateringCareNotes: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  affiliateUrl: string;
  packageVolume: string;
  priceTier: '$' | '$$' | '$$$';
  verifiedIngredients?: string;
  drainageType: string;
  moistureRetention: string;
  particleSizeNotes?: string;
  bestUse: string;
  notRecommendedFor: string;
  strengths: string[];
  limitations: string[];
  qualifyingProfiles: string[]; // matches SoilProfile.id
  designation: 'primary' | 'budget' | 'widely-available';
  lastVerifiedDate: string;
  evidenceStatus: 'manufacturer_verified' | 'retailer_only' | 'editorial_inference' | 'personally_tested' | 'unverified';
  grittyAdvisory?: string; // advice on watering/fertilizing if gritty/inorganic
}

export interface DiagnosticChoice {
  id: string;
  text: string;
  scores: { [profileId: string]: number }; // score addition for each profile
  isWarning?: boolean; // flags dangerous symptoms
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  choices: DiagnosticChoice[];
}

export const SOIL_PROFILES: SoilProfile[] = [
  {
    id: 'fast-drain',
    name: 'Fast-Drain Profile',
    designedFor: 'Plants with prolonged soil dampness, nonporous pots, humid environments, or frequent watering habits.',
    description: 'This profile is highly porous and utilizes larger mineral aggregates to speed up drainage and increase aeration. It is designed to minimize stagnant moisture pockets around root structures.',
    characteristics: 'Porous, airy, and low in fine peat elements. Promotes rapid gravity dry-down.',
    wateringCareNotes: 'Highly gritty or largely inorganic mixes dry out much faster and hold very few natural nutrients. If using a mix with these characteristics, monitor moisture levels closely and apply a dilute liquid fertilizer during the active spring and summer growth periods.'
  },
  {
    id: 'everyday-balance',
    name: 'Everyday Balance Profile',
    designedFor: 'Healthy plants undergoing routine repotting under typical indoor lighting and average household humidity.',
    description: 'A balanced profile that pairs organic potting base with medium mineral aggregates (like pumice or perlite). It provides enough water transport channels while maintaining base nutrition.',
    characteristics: 'Well-aerated, structurally stable, and moisture-balanced.',
    wateringCareNotes: 'A standard balance. Water only when the top 2-3 inches of soil are completely dry (tested with a wooden chopstick).'
  },
  {
    id: 'dry-home',
    name: 'Dry-Home Profile',
    designedFor: 'Plants located in dry climates, heated/air-conditioned rooms, breathable terracotta pots, or with infrequent watering habits.',
    description: 'This profile is designed to dry out at a moderate speed, preventing the soil from becoming bone-dry within hours. It utilizes a slightly higher ratio of organic base to retain trace moisture without becoming soggy.',
    characteristics: 'Free-draining but optimized to retain baseline ambient moisture under rapid evaporation conditions.',
    wateringCareNotes: 'Even though this profile holds slightly more baseline moisture, bottom drainage holes are still mandatory, and the soil must dry out between watering cycles.'
  },
  {
    id: 'recovery',
    name: 'Recovery Repotting Profile',
    designedFor: 'Plants showing mushy tissue, leaf collapse, or black roots where rotting parts have been pruned.',
    description: 'An exceptionally lightweight, mineral-dominant profile designed to provide a highly ventilated, dry starting environment for salvaged rhizomes.',
    characteristics: 'Sterile, low-nutrient, and extremely high in aggregate porosity.',
    warningText: 'IMPORTANT: Soil replacement alone cannot save a plant suffering from active root decay. You must physically inspect the plant, trim away all mushy or black roots with a sterilized blade, sanitize the healthy rhizome, and let it callous before repotting.',
    wateringCareNotes: 'Keep the soil dry during the initial 1-2 weeks to allow pruned root wounds to callous. Once watering resumes, apply minimally and use a dilute, gentle fertilizer only after new growth is visible.'
  },
  {
    id: 'propagation',
    name: 'Propagation Profile',
    designedFor: 'Rooted leaf cuttings, young pups, and small starters in shallow containers.',
    description: 'A lightweight profile designed for small, fragile root networks. It provides high aeration for developing roots without heavy pressure from compacted chunks.',
    characteristics: 'Fine-grained mineral additives mixed with a highly porous, light organic base.',
    wateringCareNotes: 'Starters in small pots dry out faster than mature specimens. Check moisture levels frequently, keeping the mix slightly damp but never waterlogged.'
  }
];

export const COMMERCIAL_PRODUCTS: CatalogProduct[] = [
  {
    id: 'bonsai-jack-gritty',
    name: 'Bonsai Jack Succulent and Cactus Soil Mix - Jacks Gritty Mix #111',
    brand: 'Bonsai Jack',
    imageUrl: '/coarse-silica-sand.png', // Fallback to an existing static image path
    affiliateUrl: 'https://www.amazon.com/s?k=Bonsai+Jack+Succulent+and+Cactus+Soil+Mix+Gritty+Mix+111&tag=snakeplantsoi-20',
    packageVolume: '2 Quarts',
    priceTier: '$$$',
    verifiedIngredients: '33% Pine Bark Fines, 33% Bonsai Block (Calcined Clay), 33% Pumice',
    drainageType: 'Ultra-fast gravity draining',
    moistureRetention: 'Extremely low',
    particleSizeNotes: 'Uniform 1/4 inch particles (no fine sand or peat)',
    bestUse: 'Ideal for growers prone to overwatering, non-breathable pots, or plants recovering from root rot.',
    notRecommendedFor: 'Young unrooted cuttings or growers who prefer infrequent watering cycles.',
    strengths: ['Virtually eliminates overwatering risk', 'Excellent permanent aeration', 'Does not break down or compact'],
    limitations: ['Requires more frequent watering', 'Has zero natural nutrients; requires regular liquid fertilizing'],
    qualifyingProfiles: ['fast-drain', 'recovery'],
    designation: 'primary',
    lastVerifiedDate: '2026-08-01',
    evidenceStatus: 'manufacturer_verified',
    grittyAdvisory: 'Note: Jacks Gritty Mix is 100% inorganic grit and bark. It will dry out very rapidly. You must water more frequently and apply a dilute liquid fertilizer during active growth months to provide nutrients.'
  },
  {
    id: 'hoffman-succulent',
    name: 'Organic Cactus and Succulent Soil Mix',
    brand: 'Hoffman',
    imageUrl: '/hoffman-organic-cactus-soil-mix.png',
    affiliateUrl: 'https://www.amazon.com/s?k=Hoffman+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20',
    packageVolume: '4 Quarts',
    priceTier: '$$',
    verifiedIngredients: 'Canadian Sphagnum Peat Moss, Reed Sedge Peat, Perlite, Sand, Limestone',
    drainageType: 'Fast-draining ready mix',
    moistureRetention: 'Low-to-medium',
    particleSizeNotes: 'Balanced mix of fine organic peat and medium perlite/sand aggregates',
    bestUse: 'Standard potting for healthy snake plants in pots with bottom drainage.',
    notRecommendedFor: 'Pots without drainage holes or severe root rot rescue phases.',
    strengths: ['Ready to use directly from the bag', 'Balanced pH prevents nutrient blockages', 'Good organic feeding base'],
    limitations: ['Retains more moisture than pure mineral mixes; must dry completely between waterings'],
    qualifyingProfiles: ['everyday-balance', 'dry-home', 'propagation'],
    designation: 'primary',
    lastVerifiedDate: '2026-08-01',
    evidenceStatus: 'manufacturer_verified'
  },
  {
    id: 'espoma-cactus',
    name: 'Organic Cactus & Succulent Mix',
    brand: 'Espoma',
    imageUrl: '/espoma-organic-cactus-soil-mix.png',
    affiliateUrl: 'https://www.amazon.com/s?k=Espoma+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20',
    packageVolume: '4 Quarts',
    priceTier: '$',
    verifiedIngredients: 'Sphagnum Peat Moss, Peat Humus, Perlite, Sand, Mycorrhizae Fungi',
    drainageType: 'Moderate-to-fast draining',
    moistureRetention: 'Medium-low',
    particleSizeNotes: 'Lightweight organic structure with minor perlite particles',
    bestUse: 'Organic gardening, active root stimulation, and typical home settings.',
    notRecommendedFor: 'Compacted root rot recovery or dark, humid corners.',
    strengths: ['Contains active Myco-tone fungi for root expansion', 'Very lightweight and easy to root into', 'Budget-friendly organic mix'],
    limitations: ['Humus retains moderate moisture; requires strict watering checks'],
    qualifyingProfiles: ['everyday-balance', 'dry-home'],
    designation: 'widely-available',
    lastVerifiedDate: '2026-08-01',
    evidenceStatus: 'manufacturer_verified'
  },
  {
    id: 'miracle-gro-succulent',
    name: 'Succulent & Cactus Potting Mix',
    brand: 'Miracle-Gro',
    imageUrl: '/hoffman-organic-cactus-soil-mix.png', // Fallback to compatible static image
    affiliateUrl: 'https://www.amazon.com/s?k=Miracle-Gro+Succulent+Cactus+Potting+Mix&tag=snakeplantsoi-20',
    packageVolume: '4 Quarts',
    priceTier: '$',
    verifiedIngredients: 'Sphagnum Peat Moss, Forest Products, Perlite, Fertilizer (NPK)',
    drainageType: 'Moderate draining',
    moistureRetention: 'Medium',
    particleSizeNotes: 'Fine peat moss particles with minor composted wood elements',
    bestUse: 'Budget-friendly repotting of mature plants in breathable terracotta pots.',
    notRecommendedFor: 'Frequent waterers, non-draining pots, or humid environments.',
    strengths: ['Highly affordable and widely available in local garden centers', 'Pre-fertilized for active initial growth'],
    limitations: ['High peat content can lead to soil compaction and prolonged moisture retention if overwatered'],
    qualifyingProfiles: ['dry-home', 'everyday-balance'],
    designation: 'budget',
    lastVerifiedDate: '2026-08-01',
    evidenceStatus: 'editorial_inference'
  }
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'leaves',
    text: 'What are the leaves doing?',
    choices: [
      {
        id: 'firm-upright',
        text: 'Firm and upright (Healthy baseline)',
        scores: { 'everyday-balance': 2, 'dry-home': 1 }
      },
      {
        id: 'soft-mushy',
        text: 'Soft, mushy, or collapsing at the base',
        scores: { 'recovery': 5, 'fast-drain': 2 },
        isWarning: true
      },
      {
        id: 'wrinkled-curling',
        text: 'Wrinkled, curling, or puckered (Moisture deficit)',
        scores: { 'dry-home': 3, 'everyday-balance': 1 }
      },
      {
        id: 'yellow-base',
        text: 'Yellowing near the base of the stems',
        scores: { 'recovery': 4, 'fast-drain': 3 },
        isWarning: true
      },
      {
        id: 'propagated',
        text: 'Recently propagated leaf cuttings or small pups',
        scores: { 'propagation': 5 }
      },
      {
        id: 'healthy-repot',
        text: 'I’m simply repotting a healthy plant',
        scores: { 'everyday-balance': 3, 'dry-home': 1 }
      }
    ]
  },
  {
    id: 'dampness',
    text: 'How long does the soil usually remain damp after watering?',
    choices: [
      {
        id: 'under-2',
        text: 'Less than 2 days (Fast dry-down)',
        scores: { 'dry-home': 3, 'everyday-balance': 1 }
      },
      {
        id: '3-5-days',
        text: 'About 3–5 days (Average)',
        scores: { 'everyday-balance': 3, 'fast-drain': 1 }
      },
      {
        id: 'over-7',
        text: 'More than 7 days (Prolonged dampness)',
        scores: { 'fast-drain': 4, 'recovery': 2 }
      },
      {
        id: 'unknown',
        text: 'I don’t know / I’m potting for the first time',
        scores: { 'everyday-balance': 1 }
      }
    ]
  },
  {
    id: 'light',
    text: 'How much light does the plant receive?',
    choices: [
      {
        id: 'low',
        text: 'Low light (Corner, hallway, dark office)',
        scores: { 'fast-drain': 3, 'recovery': 1 }
      },
      {
        id: 'medium-indirect',
        text: 'Medium indirect light (Few feet from window)',
        scores: { 'everyday-balance': 3 }
      },
      {
        id: 'bright-indirect',
        text: 'Bright indirect light (Near window, no direct rays)',
        scores: { 'everyday-balance': 2, 'dry-home': 1 }
      },
      {
        id: 'direct-sun',
        text: 'Some direct sun (Southern sill, patio)',
        scores: { 'dry-home': 4, 'everyday-balance': 1 }
      }
    ]
  },
  {
    id: 'pot',
    text: 'What type of pot is it currently in (or planning to use)?',
    choices: [
      {
        id: 'terracotta',
        text: 'Terracotta (Porous unglazed clay)',
        scores: { 'dry-home': 3, 'everyday-balance': 1 }
      },
      {
        id: 'ceramic',
        text: 'Glazed ceramic',
        scores: { 'fast-drain': 2, 'everyday-balance': 1 }
      },
      {
        id: 'plastic',
        text: 'Plastic or fiberglass liner',
        scores: { 'fast-drain': 2, 'everyday-balance': 1 }
      },
      {
        id: 'no-drainage',
        text: 'Decorative pot WITHOUT drainage holes',
        scores: { 'fast-drain': 5, 'recovery': 2 },
        isWarning: true
      },
      {
        id: 'unknown',
        text: 'I don’t know',
        scores: { 'everyday-balance': 1 }
      }
    ]
  },
  {
    id: 'humidity',
    text: 'How would you describe your indoor air humidity?',
    choices: [
      {
        id: 'dry',
        text: 'Dry (Air-conditioned, heated, desert climate)',
        scores: { 'dry-home': 3, 'everyday-balance': 1 }
      },
      {
        id: 'average',
        text: 'Average indoor household humidity',
        scores: { 'everyday-balance': 3 }
      },
      {
        id: 'humid',
        text: 'Humid (Bathroom, tropical region, greenhouse)',
        scores: { 'fast-drain': 3, 'recovery': 1 }
      },
      {
        id: 'unknown',
        text: 'I’m not sure',
        scores: { 'everyday-balance': 1 }
      }
    ]
  },
  {
    id: 'watering',
    text: 'What best describes your watering habits?',
    choices: [
      {
        id: 'frequent',
        text: 'I tend to water frequently (Nurturer)',
        scores: { 'fast-drain': 4, 'recovery': 2 }
      },
      {
        id: 'dry-out',
        text: 'I wait until the soil is completely dry',
        scores: { 'everyday-balance': 3, 'dry-home': 1 }
      },
      {
        id: 'neglect',
        text: 'I occasionally forget for long periods (Neglecter)',
        scores: { 'dry-home': 4 }
      },
      {
        id: 'unknown',
        text: 'I’m not sure',
        scores: { 'everyday-balance': 1 }
      }
    ]
  },
  {
    id: 'size',
    text: 'What size is the plant or pot?',
    choices: [
      {
        id: 'small',
        text: 'Small (Under 6-inch pot / plant under 12" tall)',
        scores: { 'propagation': 1, 'everyday-balance': 1 }
      },
      {
        id: 'medium',
        text: 'Medium (6 to 8-inch pot / plant 12" to 24" tall)',
        scores: { 'everyday-balance': 2 }
      },
      {
        id: 'large',
        text: 'Large (10-inch+ pot / plant over 24" tall)',
        scores: { 'everyday-balance': 1, 'fast-drain': 1 }
      }
    ]
  }
];
