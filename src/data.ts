import { QuickAnswer, ContentGuide, RecommendedProduct, FAQItem, SoilIngredient } from './types';

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    id: "best-soil-essence",
    question: "What soil is best for snake plants?",
    answer: "Snake plants thrive in a highly porous, gritty, hyper-draining soil mix with a neutral pH of 5.5 to 7.0. The standard optimal commercial configuration is a luxury organic succulent and cactus mix amended with extra pumice or perlite. This mixture simulates their native arid soils in West Africa, preventing water accumulation around their sensitive rhizomes."
  },
  {
    id: "regular-soil-danger",
    question: "Can snake plants grow in regular potting soil?",
    answer: "No, standard heavy potting soil is exceptionally lethal to snake plants. Regular soil is designed to hold moisture container-wide for thirsty plants, but for snake plants, it creates an anaerobic swamp that suffocates roots. If you must use standard soil, you need to loosen it by mixing in at least 50% drainage additions like perlite, coarse sand, or pumice."
  },
  {
    id: "repotting-freq",
    question: "How often should snake plants be repotted?",
    answer: "Snake plants are beautifully slow growers that actively prefer being slightly root-bound. They generally require repotting only once every 2 to 3 years. It is best to repot in the warm spring or early summer months, choosing a new heavy pot that is only 1 to 2 inches wider in diameter than their current container."
  },
  {
    id: "root-rot-trigger",
    question: "What causes snake plant root rot?",
    answer: "Root rot is caused almost entirely by overwatering paired with heavy, non-draining soil mixes. When water remains stagnant in the pot for multiple days, it starves roots of vital oxygen. The soil fungus (usually Pythium or Phytophthora) becomes active in these anaerobic conditions, liquefying rhizomes and killing the plant from the base up."
  }
];

export const CONTENT_GUIDES: ContentGuide[] = [
  {
    id: "best-soil",
    title: "Best Commercial Soils",
    shortDescription: "Honest, editorial review of the top 4 commercial succulent and cactus mixes tested specifically for Sansevieria drainage.",
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

export const RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    id: "hoffman-succulent",
    name: "Organic Cactus and Succulent Soil Mix",
    brand: "Hoffman",
    category: "soil",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&auto=format&fit=crop&q=80",
    bestFor: "Ultimate Out-of-the-Box Convenience",
    rating: 4.8,
    description: "A premium, ready-to-use soil expertly blended to provide essential aeration and custom drainage for desert-native plants. Critically balanced pH levels encourage rich rhizome development without needing additional heavy adjustments.",
    pros: [
      "Exceptional drainage speed out of the packaging",
      "Contains organic vermiculite and peat moss for root warmth",
      "Perfect pH-neutral formulation preventing chemical burn",
      "Excellent consistency with no heavy wood chunks"
    ],
    cons: [
      "A bit pricey for very large volume repotting setups",
      "We still recommend adding 10% perlite for huge specimens"
    ],
    linkText: "Check Price on Amazon",
    priceEstimate: "$$",
    specs: {
      "Volume": "4 Quarts",
      "Ingredients": "Sphagnum peat, perlite, sand, limestone",
      "pH Range": "6.0 - 6.8",
      "Weight": "4.2 lbs"
    }
  },
  {
    id: "espoma-cactus",
    name: "Organic Cactus & Succulent Mix",
    brand: "Espoma",
    category: "soil",
    imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a207518?w=400&auto=format&fit=crop&q=80",
    bestFor: "Organic Enthusiasts & Root Nutrition",
    rating: 4.7,
    description: "Enriched with Espoma's trademark Myco-tone, a proprietary blend of endo and ecto-mycorrhizae that helps foster deep root absorption networks while preventing water pooling.",
    pros: [
      "Contains active mycorrhizae fungi for resilient roots",
      "Sourced organically with premium forestry composts",
      "Extremely light weight and easy to work with"
    ],
    cons: [
      "Retains slightly more water; requires 3 weeks between waterings",
      "Can contain minor organic bark fragrance"
    ],
    linkText: "Check Price on Home Depot",
    priceEstimate: "$",
    specs: {
      "Volume": "4 Quarts",
      "Ingredients": "Forest products, peat moss, perlite, mycorrhizae",
      "pH Range": "5.8 - 6.5",
      "Weight": "3.5 lbs"
    }
  },
  {
    id: "horticultural-sand",
    name: "Coarse Horticultural Silica Sand",
    brand: "Perfect Plants",
    category: "ammendment",
    imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&auto=format&fit=crop&q=80",
    bestFor: "Adding Custom Soil Grittiness (DIY Mix)",
    rating: 4.9,
    description: "Washed and graded coarse sand designed explicitly for garden potting. Regular play sand is too fine and cements soil; coarse silica sand creates permanent channel voids for quick water drainage.",
    pros: [
      "Will not degrade or dissolve over time",
      "100% sterile, preventing gnat larvae or fungal weeds",
      "Provides superb structural anchor weight for tall snake plants"
    ],
    cons: [
      "Adds considerable physical weight to pots",
      "Contains zero plant nutrients (pure drainage element)"
    ],
    linkText: "Check Price on Amazon",
    priceEstimate: "$",
    specs: {
      "Volume": "2 Quarts",
      "Material": "Coarse Ground Quartzite",
      "Grain Size": "2mm - 4mm",
      "pH": "7.0 (Inert)"
    }
  },
  {
    id: "clay-terracotta",
    name: "Classic Italian Terracotta Clay Pot",
    brand: "Deroma",
    category: "pot",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80",
    bestFor: "Foolproof Moisture Control & Evaporation",
    rating: 4.9,
    description: "The gold standard of snake plant housing. Natural baked terracotta clay has high structural porosity, absorbing excess wall-side water and naturally transpiring it into the room, reducing rot risk by 70%.",
    pros: [
      "Breathable material dries soil from outer edges inwards",
      "Heavy base prevents tall snake plants from tipping over",
      "Includes extra-large centered bottom drainage hole",
      "Aesthetically timeless warm earthy neutral look"
    ],
    cons: [
      "Heavy and fragile if dropped",
      "Mineral salts can leave a white patina on the clay over a couple years"
    ],
    linkText: "Check Price on Local Nursery",
    priceEstimate: "$",
    specs: {
      "Diameter": "8 Inches",
      "Height": "7.5 Inches",
      "Material": "Natural Italian Red Clay",
      "Drainage Hole": "Yes, 0.75 in"
    }
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
