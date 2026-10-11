export interface RankedSoilProduct {
  rank: number;
  id: string;
  name: string;
  brand: string;
  award: string;
  badge: string;
  verdict: string;
  featuredBlurb?: string;
  strength: string;
  limitation: string;
  imageUrl?: string;
  hasVerifiedImage: boolean;
  affiliateUrl?: string;
  isAffiliate: boolean;
  buttonLabel: string;
  tableButtonLabel: string;
  rating?: number;
  priceEstimate?: '$$' | '$$$' | '$';
  baseComposition: string;
  aerationMedia: string;
  dryingCharacteristics: string;
  retention: string;
  specs?: Record<string, string>;
  pros?: string[];
  cons?: string[];
}

export const SOIL_RANKINGS_DISCLOSURE =
  'Disclosure: SnakePlantSoil.com is reader-supported. Some links above are affiliate links that earn us a small commission at no cost to you.';

export const RANKED_SOIL_PRODUCTS: RankedSoilProduct[] = [
  {
    rank: 1,
    id: 'bonsai-jack-gritty',
    name: 'Bonsai Jack Gritty Mix #111',
    brand: 'Bonsai Jack',
    award: 'Best Overall / Best for Fast Drainage',
    badge: 'Best for fast drainage',
    verdict:
      'Almost entirely mineral — water runs straight through, so overwatering becomes nearly impossible. The best insurance policy for your plant.',
    featuredBlurb:
      'Our #1 overall pick for fast drainage. Its gritty mineral structure allows water to pass straight through, significantly reducing the risk of stagnant moisture around rhizomes. Because it retains minimal moisture, plants in this mix require more frequent watering and periodic liquid feeding.',
    strength: 'Virtually eliminates overwatering risk',
    limitation: 'Requires more frequent watering & feeding',
    imageUrl: undefined, // No verified photo asset in repository; do not fabricate
    hasVerifiedImage: false,
    affiliateUrl:
      'https://www.amazon.com/s?k=Bonsai+Jack+Succulent+and+Cactus+Soil+Mix+Gritty+Mix+111&tag=snakeplantsoi-20',
    isAffiliate: true,
    buttonLabel: 'Check Price on Amazon',
    tableButtonLabel: 'Check Price',
    rating: 4.9,
    priceEstimate: '$$$',
    baseComposition: 'Calcined clay (Bonsai Block) & pine bark fines',
    aerationMedia: 'Coarse pumice grit (uniform 1/4" particles)',
    dryingCharacteristics: 'Very fast gravity draining (1–2 days)',
    retention: 'Extremely low',
    specs: {
      'Ingredients': '33% Pine Bark, 33% Calcined Clay, 33% Pumice',
      'Drainage': 'Ultra-fast gravity draining',
      'pH Range': '5.5 - 6.5',
      'Moisture': 'Extremely low retention'
    },
    pros: [
      'Virtually eliminates overwatering risk',
      'Permanent aeration channels that never compact',
      'Does not break down or mold over time'
    ],
    cons: [
      'Requires more frequent watering cycles',
      'Zero natural organic nutrients; requires liquid fertilizing'
    ]
  },
  {
    rank: 2,
    id: 'hoffman-succulent',
    name: 'Organic Cactus and Succulent Soil Mix',
    brand: 'Hoffman',
    award: 'Best for Beginners',
    badge: 'Easiest / best balanced',
    verdict:
      'Ready to use straight from the bag. The no-fuss pick for average indoor conditions — just let it dry fully between waterings.',
    strength: 'Ready to use directly from the bag',
    limitation: 'Holds more moisture — must dry completely between waterings',
    imageUrl: '/hoffman-organic-cactus-soil-mix.png', // Verified asset in public/
    hasVerifiedImage: true,
    affiliateUrl:
      'https://www.amazon.com/s?k=Hoffman+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20',
    isAffiliate: true,
    buttonLabel: 'Check Price on Amazon',
    tableButtonLabel: 'Check Price',
    rating: 4.8,
    priceEstimate: '$$',
    baseComposition: 'Canadian sphagnum peat moss & reed sedge peat',
    aerationMedia: 'Perlite, sand & limestone buffer',
    dryingCharacteristics: 'Fast-to-moderate drying (3–5 days)',
    retention: 'Moderate',
    specs: {
      'Volume': '4 Quarts',
      'Ingredients': 'Sphagnum peat, perlite, sand, limestone',
      'pH Range': '6.0 - 6.8',
      'Weight': '4.2 lbs'
    },
    pros: [
      'Ready to use directly from the bag',
      'Balanced neutral pH prevents nutrient lockout',
      'Reliable peat and sand baseline structure'
    ],
    cons: [
      'Holds more moisture than gritty mixes; must dry completely between waterings',
      'May benefit from added pumice for extra-large containers'
    ]
  },
  {
    rank: 3,
    id: 'espoma-cactus',
    name: 'Organic Cactus & Succulent Mix',
    brand: 'Espoma',
    award: 'Best Organic Option',
    badge: 'Best organic',
    verdict:
      "The organic gardener's pick — active Myco-tone fungi boost root growth. Keep a strict dry-out routine and it performs beautifully.",
    strength: 'Myco-tone fungi promote root expansion',
    limitation: 'Peat humus holds moisture — strict watering checks needed',
    imageUrl: '/espoma-organic-cactus-soil-mix.png', // Verified asset in public/
    hasVerifiedImage: true,
    affiliateUrl:
      'https://www.amazon.com/s?k=Espoma+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20',
    isAffiliate: true,
    buttonLabel: 'Check Price on Amazon',
    tableButtonLabel: 'Check Price',
    rating: 4.7,
    priceEstimate: '$',
    baseComposition: 'Peat humus, sphagnum peat & aged forest products',
    aerationMedia: 'Perlite & Myco-tone mycorrhizae blend',
    dryingCharacteristics: 'Moderate drying (4–7 days)',
    retention: 'Moderate-High',
    specs: {
      'Volume': '4 Quarts',
      'Ingredients': 'Forest products, peat moss, perlite, mycorrhizae',
      'pH Range': '5.8 - 6.5',
      'Weight': '3.5 lbs'
    },
    pros: [
      'Enriched with Myco-tone mycorrhizae fungi for root development',
      'Organic formula sourced with natural forest products',
      'Lightweight and easy for roots to penetrate'
    ],
    cons: [
      'Peat humus retains moisture longer than mineral grit; requires strict dry-down',
      'Needs good drainage holes to prevent soggy lower soil'
    ]
  }
];

export const DECISION_GUIDE = [
  {
    question: 'Do you overwater?',
    choice: '#1 Bonsai Jack',
    explanation: 'Almost purely mineral so water runs straight through. Forgives heavy hands.'
  },
  {
    question: 'Want the easiest option?',
    choice: '#2 Hoffman',
    explanation: 'Ready to use out of the bag. Open bag, pot plant, done.'
  },
  {
    question: 'Prefer organic?',
    choice: '#3 Espoma',
    explanation: 'Enriched with Myco-tone beneficial fungi. Just respect the dry periods.'
  }
];

export function getRankedSoilById(id: string): RankedSoilProduct | undefined {
  return RANKED_SOIL_PRODUCTS.find((p) => p.id === id);
}
