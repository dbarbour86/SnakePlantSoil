import { QuickAnswer, ContentGuide, RecommendedProduct, FAQItem, SoilIngredient } from './types';
import { getDynamicArticles } from './content';

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    id: "best-soil-essence",
    question: "What soil is best for snake plants?",
    answer: "Snake plants grow best in a well-draining soil mix with a neutral pH of 5.5 to 7.0. A practical starting formula is a succulent and cactus mix amended with perlite or pumice to simulate dry, porous conditions and prevent water accumulation around the roots."
  },
  {
    id: "regular-soil-danger",
    question: "Can snake plants grow in regular potting soil?",
    answer: "Standard potting soil is generally too dense and retains water too long for snake plants. If you must use regular soil, it is recommended to adjust it by mixing in at least 50% drainage additions like perlite, coarse sand, or pumice to improve airflow."
  },
  {
    id: "repotting-freq",
    question: "How often should snake plants be repotted?",
    answer: "Snake plants are relatively slow growers that can remain in the same container for 2 to 3 years. It is best to repot in the warm spring or early summer, choosing a pot that is only 1 to 2 inches wider than the current container."
  },
  {
    id: "root-rot-trigger",
    question: "What causes snake plant root rot?",
    answer: "Root rot is frequently triggered by prolonged wet conditions in heavy, slow-draining soil mixes. When water sits in the pot for multiple days, it blocks oxygen flow to the roots, allowing soil-borne pathogens to become active and damage root tissues."
  }
];

export const STATIC_GUIDES: ContentGuide[] = [
  {
    id: "best-soil",
    title: "The 3 Best Soils for Snake Plants",
    shortDescription: "Editorial comparison of the 3 best commercial soil mixes for snake plants, ranked by drainage speed, aeration, and overwatering prevention.",
    category: "soil",
    readTime: "6 min read",
    iconName: "Trees",
    slug: "best-snake-plant-soil"
  },
  {
    id: "diy-mix",
    title: "DIY Snake Plant Soil Mix Recipe",
    shortDescription: "Our signature 3-2-1 gritty recipe. Learn how to mix potting soil, perlite, and coarse sand for the absolute ultimate home mix.",
    category: "soil",
    readTime: "7 min read",
    iconName: "Beaker",
    slug: "diy-snake-plant-soil-mix"
  },
  {
    id: "root-rot",
    title: "Snake Plant Root Rot Guide",
    shortDescription: "How to identify, treat, and surgically recover a snake plant suffering from mushy leaves, soggy stems, or black rhizomes.",
    category: "root-rot",
    readTime: "8 min read",
    iconName: "HeartPulse",
    slug: "snake-plant-root-rot-guide"
  },
  {
    id: "best-pots",
    title: "Best Pots for Snake Plants",
    shortDescription: "Why breathable porous clay terracotta is king. A deep dive of container sizes, drainage wholes, and aesthetic pot recommendations.",
    category: "pots",
    readTime: "5 min read",
    iconName: "Layers",
    slug: "best-pots-for-snake-plants"
  },
  {
    id: "care-guide",
    title: "Complete Care & Watering Guide",
    shortDescription: "Mastering the 'Soak and Dry' watering cycle, seasonal routines, winter dryness tactics, and light level placements.",
    category: "care",
    readTime: "9 min read",
    iconName: "Compass",
    slug: "snake-plant-care-guide"
  }
];

export const CONTENT_GUIDES: ContentGuide[] = [
  ...STATIC_GUIDES,
  ...getDynamicArticles()
];

export {
  RANKED_SOIL_PRODUCTS,
  type RankedSoilProduct,
  DECISION_GUIDE,
  SOIL_RANKINGS_DISCLOSURE,
  getRankedSoilById
} from './soilRankings';

export const RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    id: "bonsai-jack-gritty",
    name: "Bonsai Jack Gritty Mix #111",
    brand: "Bonsai Jack",
    category: "soil",
    imageUrl: "", // No verified photo asset in repository
    bestFor: "Best Overall / Fast Drainage",
    rating: 4.9,
    description: "Almost entirely mineral — water runs straight through, so overwatering becomes nearly impossible. The best insurance policy for your plant.",
    pros: [
       "Virtually eliminates overwatering risk",
       "Permanent aeration channels that never compact",
       "Does not break down or mold over time"
    ],
    cons: [
       "Requires more frequent watering cycles",
       "Zero natural organic nutrients; requires liquid fertilizing"
    ],
    linkText: "Check Price on Amazon",
    priceEstimate: "$$$",
    specs: {
      "Volume": "2 Quarts",
      "Ingredients": "33% Pine Bark, 33% Calcined Clay, 33% Pumice",
      "pH Range": "5.5 - 6.5",
      "Moisture": "Extremely low retention"
    },
    affiliateUrl: "https://www.amazon.com/s?k=Bonsai+Jack+Succulent+and+Cactus+Soil+Mix+Gritty+Mix+111&tag=snakeplantsoi-20"
  },
  {
    id: "hoffman-succulent",
    name: "Organic Cactus and Succulent Soil Mix",
    brand: "Hoffman",
    category: "soil",
    imageUrl: "/hoffman-organic-cactus-soil-mix.png",
    bestFor: "Best for Beginners",
    rating: 4.8,
    description: "A ready-to-use soil blended to provide drainage for desert-native plants. Balanced pH levels support root development without requiring additional heavy adjustments.",
    pros: [
       "Good drainage speed directly from the bag",
       "Contains organic peat moss for healthy baseline support",
       "Neutral pH formulation",
       "Consistent blend with no large wood chunks"
    ],
    cons: [
       "Holds more moisture than gritty mixes; must dry completely between waterings",
       "May benefit from extra perlite for very large specimens"
    ],
    linkText: "Check Price on Amazon",
    priceEstimate: "$$",
    specs: {
      "Volume": "4 Quarts",
      "Ingredients": "Sphagnum peat, perlite, sand, limestone",
      "pH Range": "6.0 - 6.8",
      "Weight": "4.2 lbs"
    },
    affiliateUrl: "https://www.amazon.com/s?k=Hoffman+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20"
  },
  {
    id: "espoma-cactus",
    name: "Organic Cactus & Succulent Mix",
    brand: "Espoma",
    category: "soil",
    imageUrl: "/espoma-organic-cactus-soil-mix.png",
    bestFor: "Best Organic Option",
    rating: 4.7,
    description: "Enriched with Espoma's Myco-tone blend of mycorrhizae, designed to support root absorption and allow drainage.",
    pros: [
       "Contains mycorrhizae fungi for roots",
       "Sourced organically with forest products",
       "Lightweight mix"
    ],
    cons: [
       "Retains slightly more water than high-mineral gritty mixes",
       "Can contain minor organic wood bark fragrance"
    ],
    linkText: "Check Price on Amazon",
    priceEstimate: "$",
    specs: {
      "Volume": "4 Quarts",
      "Ingredients": "Forest products, peat moss, perlite, mycorrhizae",
      "pH Range": "5.8 - 6.5",
      "Weight": "3.5 lbs"
    },
    affiliateUrl: "https://www.amazon.com/s?k=Espoma+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20"
  },
  {
    id: "horticultural-sand",
    name: "Coarse Horticultural Silica Sand",
    brand: "Perfect Plants",
    category: "ammendment",
    imageUrl: "/coarse-horticultural-silica-sand.png",
    bestFor: "Adding Custom Soil Grittiness (DIY Mix)",
    rating: 4.9,
    description: "Washed coarse sand designed for garden potting. Unlike fine play sand which can compact, coarse sand creates channel voids for water drainage.",
    pros: [
       "Will not degrade over time",
       "Clean and sterile, preventing gnat larvae or weeds",
       "Provides structural anchor weight for tall snake plants"
    ],
    cons: [
       "Adds physical weight to pots",
       "Contains no plant nutrients"
    ],
    linkText: "Check Price on Amazon",
    priceEstimate: "$",
    specs: {
      "Volume": "2 Quarts",
      "Material": "Coarse Ground Quartzite",
      "Grain Size": "2mm - 4mm",
      "pH": "7.0 (Inert)"
    },
    affiliateUrl: "https://www.amazon.com/s?k=Coarse+Horticultural+Silica+Sand+Perfect+Plants&tag=snakeplantsoi-20"
  },
  {
    id: "clay-terracotta",
    name: "Classic Italian Terracotta Clay Pot",
    brand: "Deroma",
    category: "pot",
    imageUrl: "/classic-terracotta-clay-pot.png",
    bestFor: "Breathable Container Option",
    rating: 4.9,
    description: "A traditional choice for snake plants. Porous terracotta clay allows wall-side moisture to transpire, which may help reduce prolonged wet conditions.",
    pros: [
       "Breathable material dries soil from outer edges inwards",
       "Heavy base prevents tall snake plants from tipping over",
       "Includes bottom drainage hole",
       "Classic warm earthy neutral look"
    ],
    cons: [
       "Heavy and fragile if dropped",
       "Mineral salts can leave a white patina on the clay over time"
    ],
    linkText: "Check Price on Amazon",
    priceEstimate: "$",
    specs: {
      "Diameter": "8 Inches",
      "Height": "7.5 Inches",
      "Material": "Natural Italian Red Clay",
      "Drainage Hole": "Yes, 0.75 in"
    },
    affiliateUrl: "https://www.amazon.com/Terracotta-Drainage-Cylinder-Planter-587-42-0/dp/B08QYLP91Q?th=1&tag=snakeplantsoi-20"
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "cactus-soil-necessity",
    question: "Do snake plants need cactus soil?",
    answer: "Yes. While they do not technically require standard commercial cactus formulations exclusively, they absolutely do require the physical qualities of cactus soil. It is sandy, loose, and low in water retention. Placing them in generic peat-heavy garden soil almost guarantees slow decline or aggressive root breakdown.",
    category: "soil"
  },
  {
    id: "miracle-gro-quality",
    question: "Is Miracle-Gro good for snake plants?",
    answer: "Miracle-Gro Succulent & Cactus mix is a functional and highly accessible starting point. However, direct testing reveals it contains high peat levels. For the best security against rot, we recommend taking standard Miracle-Gro cactus soil and blending it with 20% coarse sand or pure pumice pebbles to increase the drainage factor.",
    category: "soil"
  },
  {
    id: "low-light-survival",
    question: "Can snake plants survive in low light?",
    answer: "Yes, snake plants can survive in low-light corners for many months. However, there is a massive difference between surviving and thriving. In low light, their growth stops almost completely, and they consume almost zero water. Because evaporation slows down in darker areas, you should only water low-light plants once every 6 to 8 weeks.",
    category: "care"
  },
  {
    id: "drainage-holes-non-negotiable",
    question: "Should snake plant pots have drainage holes?",
    answer: "Yes! Bottom drainage holes are 100% non-negotiable. Without a dedicated pathway for excess liquid water to run completely out of the soil column, the bottom layer of potting mix acts like a permanent sponge. Even with succulent soil, a pot with no drainage hole will pool water, creating anaerobic fungi that disintegrate root structures.",
    category: "pots"
  },
  {
    id: "root-rot-prevention-soil",
    question: "What soil formula prevents root rot?",
    answer: "The best rot-prevention soil is a mineral-dominant formulation. Our recommended blend consists of 1/3 coarse inorganic grit (pumice, perlite, or clay chips), 1/3 coarse washed silica sand, and 1/3 clean wood-based potting compost. This ensures that even in an accidental heavy overwatering event, gravity will clear excess water from the root zone within 10 seconds, leaving the soil pleasantly humid but never oxygen-deprived.",
    category: "soil"
  },
  {
    id: "potting-soil-difference",
    question: "How do I recognize overwatered snake plants?",
    answer: "Look for warning signs early: yellowing leaves that lose their structural stiffness, soft wrinkled texture halfway up the blade, wet dark brown patches at the soil baseline, or leaves easily pulling loose when tugged. Healthy leaves should feel firm, fibrous, and resemble a sturdy sword.",
    category: "care"
  }
];

export const DEFAULT_INGREDIENTS: SoilIngredient[] = [
  {
    id: "compost",
    name: "Organic Compost/Standard Soil",
    description: "Rich organic base providing mild nitrogen nutrients and basic anchor matrix.",
    baseDrainage: 2,
    baseRetention: 9,
    baseAeration: 3,
    purpose: "Provides natural humic nutrition & secure physical root grip.",
    percentage: 40
  },
  {
    id: "perlite",
    name: "Horticultural Perlite",
    description: "Expanded volcanic silica glass. Extremely lightweight, porous, and water-repellent.",
    baseDrainage: 9,
    baseRetention: 1,
    baseAeration: 10,
    purpose: "Instantly creates air pocket voids preventing compaction.",
    percentage: 30
  },
  {
    id: "coarse-sand",
    name: "Washed Coarse Sand",
    description: "Inert ground minerals with chunky grains. Creates heavy micro-channels.",
    baseDrainage: 8,
    baseRetention: 2,
    baseAeration: 6,
    purpose: "Adds quick gravity flow and helpful structural weight.",
    percentage: 20
  },
  {
    id: "pumice",
    name: "Premium Natural Pumice",
    description: "Porose volcanic rock that absorbs slight moisture inside while draining outward.",
    baseDrainage: 10,
    baseRetention: 3,
    baseAeration: 9,
    purpose: "The gold-standard mineral for long-term grit structure.",
    percentage: 10
  }
];
