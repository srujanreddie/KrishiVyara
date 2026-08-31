import { CropScanResult, FarmDiaryEntry, UserProfile, AgronomistExpert, CurrentWeatherState } from '../types';

export const initialUserProfile: UserProfile = {
  id: 'farmer-001',
  name: 'Rameshwar Patil',
  phone: '+91 98234 56789',
  village: 'Pimpalgaon',
  district: 'Nashik',
  state: 'Maharashtra',
  farmSizeAcres: 4.5,
  soilType: 'black',
  primaryCrops: ['Tomato', 'Cotton', 'Rice', 'Soybean', 'Chili'],
  languagePreference: 'en',
  highContrastMode: false,
  largeFontMode: false,
  voiceAutoRead: true,
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
};

export const sampleDiseases: CropScanResult[] = [
  {
    id: 'scan-tomato-early-blight',
    cropName: 'Tomato',
    diseaseOrPestName: 'Early Blight (Alternaria solani)',
    scientificName: 'Alternaria solani',
    pathogenType: 'fungal',
    infectionStage: 'intermediate',
    spreadRisk: 'high',
    yieldLossRiskPercent: 40,
    severity: 'moderate',
    confidenceScore: 94,
    affectedParts: ['Lower mature leaves', 'Leaf petioles', 'Stem base collar'],
    transmissionMethod: 'Airborne fungal conidia and rain splash carrying spores from infected soil residue directly to lower leaves',
    favorableConditions: {
      humidity: '>80% Relative Humidity with prolonged wetness',
      tempRange: '24°C - 30°C',
      triggerFactors: ['Overhead irrigation splashing soil', 'Dense leaf canopy with poor air circulation', 'Frequent morning fog or dew']
    },
    visualSigns: [
      'Concentric target-board brown rings with distinct dark margins',
      'Prominent chlorotic yellow halos surrounding dead necrotized tissue',
      'Collar rot lesions forming at stem base near soil line'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Alternaria_solani_-_leaf_lesions.jpg',
    symptoms: [
      'Concentric target-board rings on older lower leaves',
      'Yellow halo around brown circular spots',
      'Premature defoliation starting from bottom canopy'
    ],
    causes: [
      'Warm temperature (24-30°C) with prolonged leaf wetness',
      'Splashing water from soil during overhead irrigation or heavy rain',
      'Dense foliage limiting airflow'
    ],
    chemicalTreatment: {
      name: 'Mancozeb 75% WP (or Azoxystrobin 23% SC)',
      activeIngredient: 'Mancozeb 75% WP',
      tradeNames: ['Dithane M-45', 'Indofil M-45', 'Uthane'],
      dosagePerLiter: '2.5 grams per Liter of water',
      spoonsPer15LPump: 2.5, // 37.5 grams = ~2.5 tablespoons in a standard 15L pump
      mlOrGramsPerLiter: 2.5,
      unitType: 'grams',
      maxSpraysPerSeason: 3,
      waitingPeriodDays: 5,
      safetyGear: ['mask', 'gloves', 'goggles', 'long_sleeves'],
      estimatedCost: '₹140 - ₹180 per 250g pack'
    },
    organicTreatment: {
      name: 'Neem Oil + Baking Soda Spray (Desi Remedy)',
      recipe: 'Mix 5ml pure cold-pressed Neem oil + 2 grams Baking Soda + 2 drops mild soap in 1 Liter warm water. Shake thoroughly before spraying.',
      ingredients: ['Cold-pressed Neem Oil (10,000 ppm)', 'Baking Soda', 'Natural soap base', 'Clean water'],
      mixingRatio: '5 ml / Liter water (75 ml in 15L knapsack pump)',
      preparationTime: '10 minutes',
      applicationMethod: 'Spray on both upper and lower surface of leaves at sunset.'
    },
    bestSprayingTime: {
      timeOfDay: 'late_evening',
      recommendedHours: '4:30 PM to 6:30 PM',
      reason: 'Cooler temperature allows chemical absorption without leaf scorching. Protects pollinating honeybees.',
      maxTemperatureC: 32,
      minWindSpeedKmh: 2,
      maxWindSpeedKmh: 12
    },
    weatherRisk: {
      safeToSpray: true,
      riskLevel: 'safe',
      rainRiskAlert: 'No rain forecast for the next 24 hours. Safe for spraying.',
      heatSpikeAlert: 'Moderate day temperature (31°C). Evening spraying recommended.',
      windDriftAlert: 'Gentle breeze (6 km/h). Low drift risk.',
      mainRecommendation: 'Clear window for spraying between 4:30 PM and 6:30 PM today.'
    },
    preventionTips: [
      'Mulch soil around tomato base with straw to prevent fungal spores from splashing up.',
      'Prune lowest leaves touching the wet soil.',
      'Avoid overhead sprinkler watering; prefer drip irrigation.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    audioSummaryText: 'Plant Doctor diagnosis: Tomato Early Blight with moderate severity. Recommended treatment is Mancozeb at 2.5 spoons per 15 liter pump, sprayed late evening around 5 PM.',
    source: 'gemini-ai'
  },
  {
    id: 'scan-cotton-pink-bollworm',
    cropName: 'Cotton',
    diseaseOrPestName: 'Pink Bollworm (Pectinophora gossypiella)',
    scientificName: 'Pectinophora gossypiella',
    pathogenType: 'pest',
    infectionStage: 'advanced',
    spreadRisk: 'high',
    yieldLossRiskPercent: 55,
    severity: 'severe',
    confidenceScore: 92,
    affectedParts: ['Squares (flower buds)', 'Young developing green bolls', 'Lint and seed fibers'],
    transmissionMethod: 'Nocturnal adult moths laying microscopic eggs on young squares and bracts; newly hatched caterpillars bore inside within 20 minutes',
    favorableConditions: {
      humidity: '65% - 85% RH with warm nights',
      tempRange: '28°C - 36°C',
      triggerFactors: ['Continuous mono-cropping of cotton', 'Staggered planting across neighboring plots', 'Late-season crop extension']
    },
    visualSigns: [
      'Rosetted or "rosette-shaped" flowers tied by silk webbing that fail to open',
      'Pin-head entry holes in young developing bolls with brown staining',
      'Destroyed seeds, stained yellow-brown lint, and exit holes in mature bolls'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Pectinophora_gossypiella_1265079.jpg',
    symptoms: [
      'Rosetted flowers that fail to open properly',
      'Small entry holes in young developing bolls',
      'Discolored lint and damaged seeds inside opening bolls'
    ],
    causes: [
      'Late season pest resurgence',
      'High nocturnal temperatures and humidity',
      'Non-compliance with refuge crop planting'
    ],
    chemicalTreatment: {
      name: 'Emamectin Benzoate 5% SG',
      activeIngredient: 'Emamectin Benzoate 5% SG',
      tradeNames: ['Proclaim', 'EM-1', 'Missile'],
      dosagePerLiter: '0.4 grams per Liter of water',
      spoonsPer15LPump: 0.5, // 6 grams per 15L pump
      mlOrGramsPerLiter: 0.4,
      unitType: 'grams',
      maxSpraysPerSeason: 2,
      waitingPeriodDays: 14,
      safetyGear: ['mask', 'gloves', 'goggles', 'boots', 'long_sleeves'],
      estimatedCost: '₹320 - ₹380 per 100g pack'
    },
    organicTreatment: {
      name: 'Pheromone Trap + Neem Astra (Organic Control)',
      recipe: 'Install 8-10 Pink Bollworm Pheromone traps per acre at crop height. Spray Dashaparni Kashayam or Neem Seed Kernel Extract (NSKE 5%).',
      ingredients: ['Gossyplure Pheromone Lures & Delta Traps', 'Neem Seed Kernel Extract 5%'],
      mixingRatio: '50 grams NSKE per Liter of water (750 grams in 15L pump)',
      preparationTime: '24 hours soaking',
      applicationMethod: 'Spray thoroughly on squares and bolls.'
    },
    bestSprayingTime: {
      timeOfDay: 'early_morning',
      recommendedHours: '6:30 AM to 9:00 AM',
      reason: 'Larvae are most active on boll surface before seeking internal entry.',
      maxTemperatureC: 30,
      minWindSpeedKmh: 3,
      maxWindSpeedKmh: 10
    },
    weatherRisk: {
      safeToSpray: false,
      riskLevel: 'danger',
      rainRiskAlert: 'Heavy rain shower expected in 2.5 hours! DO NOT SPRAY now.',
      heatSpikeAlert: 'Heat spike (37°C) triggers fast egg hatching.',
      windDriftAlert: 'Moderate wind (14 km/h).',
      mainRecommendation: 'Delay chemical spray until tomorrow morning after rain stops.'
    },
    preventionTips: [
      'Install funnel pheromone traps at 45 days after sowing.',
      'Release Trichogramma egg parasitoids @ 60,000/acre weekly.',
      'Destroy fallen squares and infested rosetted flowers.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    audioSummaryText: 'Danger alert: Severe Pink Bollworm attack on cotton. Warning: Rain expected in 2.5 hours, do not spray today! Use Emamectin Benzoate tomorrow morning.',
    source: 'gemini-ai'
  },
  {
    id: 'scan-rice-bacterial-blight',
    cropName: 'Rice (Paddy)',
    diseaseOrPestName: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    pathogenType: 'bacterial',
    infectionStage: 'intermediate',
    spreadRisk: 'high',
    yieldLossRiskPercent: 35,
    severity: 'moderate',
    confidenceScore: 89,
    affectedParts: ['Leaf blades', 'Leaf margins', 'Flag leaves during grain filling'],
    transmissionMethod: 'Bacterial entry through natural hydathodes and wind-induced leaf friction wounds, multiplied rapidly by flood water currents',
    favorableConditions: {
      humidity: '>85% RH with continuous cloudy weather',
      tempRange: '25°C - 34°C',
      triggerFactors: ['Excessive un-split urea fertilizer', 'Standing deep stagnant water', 'Strong monsoon gusts with rain']
    },
    visualSigns: [
      'Wavy water-soaked margins turning yellowish-white from leaf tip downwards',
      'Tiny amber-colored bacterial exudate beads on leaf veins in early morning',
      'Drying and rolling of leaves resulting in bleached "kresek" appearance'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Bacterial_blight_of_rice.jpeg',
    symptoms: [
      'Water-soaked to yellowish-white wavy lesions along leaf margins',
      'Milky bacterial ooze drops visible on young lesions in morning dew',
      'Leaves dry up and turn grayish-white (kresek stage)'
    ],
    causes: [
      'High humidity (>70%) and warm days (25-34°C)',
      'Excessive nitrogen fertilizer application',
      'Windstorm injury allowing bacteria entry'
    ],
    chemicalTreatment: {
      name: 'Copper Oxychloride 50% WP + Streptocycline',
      activeIngredient: 'Copper Oxychloride (2.5g) + Streptomycin Sulphate (0.1g)',
      tradeNames: ['Blitox 50', 'Phytomycin', 'Streptocycline'],
      dosagePerLiter: '2.5g Copper + 1g Streptocycline per 10 Liters',
      spoonsPer15LPump: 2.5,
      mlOrGramsPerLiter: 2.5,
      unitType: 'grams',
      maxSpraysPerSeason: 2,
      waitingPeriodDays: 10,
      safetyGear: ['mask', 'gloves', 'long_sleeves'],
      estimatedCost: '₹210 per combo kit'
    },
    organicTreatment: {
      name: 'Cow Urine + Asafoetida (Hing) Fermented Bio-Wash',
      recipe: 'Mix 1 Liter fresh cow urine + 50g asafoetida (hing) in 10 Liters of water. Strain through muslin cloth.',
      ingredients: ['Desi Cow Urine', 'Asafoetida / Hing powder', 'Water'],
      mixingRatio: '100 ml per Liter of water',
      preparationTime: '2 hours',
      applicationMethod: 'Foliar spray twice at 7-day interval.'
    },
    bestSprayingTime: {
      timeOfDay: 'late_evening',
      recommendedHours: '4:00 PM to 6:00 PM',
      reason: 'Bacteria spread rapidly in wet morning dew; evening spray dries slowly and prevents spore germination.',
      maxTemperatureC: 32,
      minWindSpeedKmh: 2,
      maxWindSpeedKmh: 10
    },
    weatherRisk: {
      safeToSpray: true,
      riskLevel: 'safe',
      rainRiskAlert: 'Dry weather forecast for next 48 hours.',
      heatSpikeAlert: 'Normal agro-climatic conditions.',
      windDriftAlert: 'Wind speed 5 km/h (Calm).',
      mainRecommendation: 'Ideal conditions for evening protective spray.'
    },
    preventionTips: [
      'Split nitrogen fertilizer into 3-4 doses; avoid single heavy dose.',
      'Drain stagnant field water for 2-3 days to reduce field humidity.',
      'Dip seedlings in 2% Pseudomonas fluorescens before transplanting.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    audioSummaryText: 'Rice bacterial leaf blight detected. Treat with Copper Oxychloride 2.5 spoons per 15L pump. Spray in late evening. Avoid excess urea.',
    source: 'gemini-ai'
  },
  {
    id: 'scan-wheat-yellow-rust',
    cropName: 'Wheat',
    diseaseOrPestName: 'Yellow Stripe Rust (Puccinia striiformis)',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    pathogenType: 'fungal',
    infectionStage: 'advanced',
    spreadRisk: 'high',
    yieldLossRiskPercent: 65,
    severity: 'severe',
    confidenceScore: 96,
    affectedParts: ['Leaf lamina', 'Leaf sheaths', 'Glumes of the wheat earhead'],
    transmissionMethod: 'Airborne urediniospores carried hundreds of kilometers across northern plains by high altitude wind currents',
    favorableConditions: {
      humidity: '>90% RH with dense morning fog and dew',
      tempRange: '10°C - 16°C',
      triggerFactors: ['Extended cool winter weather with prolonged dew period', 'Susceptible variety cultivated over vast acreage']
    },
    visualSigns: [
      'Linear bright yellow powdery stripes of uredinial pustules parallel to leaf veins',
      'Yellow urediniospore dust staining farmer fingers upon touch',
      'Severe leaf chlorosis followed by complete leaf necrosis and stunted spikes'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Wheat_leaf_rust_on_wheat.jpg',
    symptoms: [
      'Yellow to orange-yellow powdery pustules arranged in linear stripes on leaves',
      'Leaves turn dry and chlorotic as stripes coalesce',
      'Yellow dust on fingers when leaf is touched'
    ],
    causes: [
      'Cool temperatures (10-15°C) with persistent fog/dew',
      'Susceptible crop variety',
      'High soil moisture'
    ],
    chemicalTreatment: {
      name: 'Propiconazole 25% EC',
      activeIngredient: 'Propiconazole 25% EC',
      tradeNames: ['Tilt', 'Bumper', 'Radar'],
      dosagePerLiter: '1.0 ml per Liter of water',
      spoonsPer15LPump: 1.0, // 15 ml per 15L pump = ~1 tablespoon
      mlOrGramsPerLiter: 1.0,
      unitType: 'ml',
      maxSpraysPerSeason: 2,
      waitingPeriodDays: 20,
      safetyGear: ['mask', 'gloves', 'goggles', 'long_sleeves'],
      estimatedCost: '₹350 per 250ml bottle'
    },
    organicTreatment: {
      name: 'Sour Buttermilk (Khatta Chhachh) + Copper Plate Solution',
      recipe: 'Take 5 Liters sour churned buttermilk in a mud pot with a copper plate submerged for 10 days. Dilute in 100L water.',
      ingredients: ['Sour Buttermilk / Chhachh', 'Copper scrap/plate', 'Clean water'],
      mixingRatio: '50 ml per Liter water (750 ml in 15L pump)',
      preparationTime: '10 days fermentation',
      applicationMethod: 'Spray uniformly upon first sign of stripe rust.'
    },
    bestSprayingTime: {
      timeOfDay: 'early_morning',
      recommendedHours: '7:00 AM to 9:30 AM',
      reason: 'Target active fungal germination as morning dew evaporates.',
      maxTemperatureC: 22,
      minWindSpeedKmh: 2,
      maxWindSpeedKmh: 12
    },
    weatherRisk: {
      safeToSpray: true,
      riskLevel: 'caution',
      rainRiskAlert: 'Light overcast, no heavy rain predicted.',
      heatSpikeAlert: 'Cool humid conditions promote rapid rust spread.',
      windDriftAlert: 'Gentle breeze 7 km/h.',
      mainRecommendation: 'Urgent spray required to prevent total crop loss.'
    },
    preventionTips: [
      'Sow rust-resistant varieties like DBW 187, DBW 303, HD 3226.',
      'Avoid late sowing in sub-mountainous or river-bed areas.',
      'Regular scouting during January-February foggy mornings.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    audioSummaryText: 'Urgent diagnosis: Severe Yellow Stripe Rust on Wheat. Apply Propiconazole 15 ml per pump immediately to stop fungal spore spread.',
    source: 'gemini-ai'
  },
  {
    id: 'scan-chili-leaf-curl',
    cropName: 'Chili',
    diseaseOrPestName: 'Chili Leaf Curl Virus (transmitted by Whiteflies & Thrips)',
    scientificName: 'Begomovirus / Scirtothrips dorsalis',
    pathogenType: 'viral',
    infectionStage: 'intermediate',
    spreadRisk: 'high',
    yieldLossRiskPercent: 50,
    severity: 'moderate',
    confidenceScore: 91,
    affectedParts: ['Apical shoot tips', 'Young expanding leaves', 'Flower buds and young pods'],
    transmissionMethod: 'Persistent transmission by piercing-sucking insect vectors (Whitefly Bemisia tabaci and Chili Thrips Scirtothrips dorsalis)',
    favorableConditions: {
      humidity: '40% - 60% RH with dry hot weather',
      tempRange: '30°C - 38°C',
      triggerFactors: ['Dry hot spells accelerating vector reproduction', 'Nearby weed reservoirs (Parthenium, Solanum weeds)', 'Excessive pesticide sprays that kill natural predatory mites']
    },
    visualSigns: [
      'Upward boat-shaped or cup-shaped leaf curling indicating Thrips rasped injury',
      'Thickened leathery puckered leaves with shortened internodes',
      'Severe plant stunting with flower abortion and small distorted fruit'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Taphrina_deformans_1.jpg',
    symptoms: [
      'Upward curling of leaf margins like a boat/cup (Thrips damage)',
      'Downward curling with thickened puckered leaves (Mite damage)',
      'Stunted plant growth and flower drop'
    ],
    causes: [
      'Whitefly and Thrips pest explosion during warm dry spells',
      'Nearby infected weed hosts',
      'High temperatures (>35°C)'
    ],
    chemicalTreatment: {
      name: 'Diafenthiuron 50% WP (or Fipronil 5% SC)',
      activeIngredient: 'Diafenthiuron 50% WP',
      tradeNames: ['Pegasus', 'Polo', 'Agatas'],
      dosagePerLiter: '1.2 grams per Liter of water',
      spoonsPer15LPump: 1.2, // ~18 grams per 15L pump
      mlOrGramsPerLiter: 1.2,
      unitType: 'grams',
      maxSpraysPerSeason: 2,
      waitingPeriodDays: 7,
      safetyGear: ['mask', 'gloves', 'goggles', 'long_sleeves'],
      estimatedCost: '₹420 per 250g pack'
    },
    organicTreatment: {
      name: 'Agniastra / Garlic-Chili-Neem Bio-Extract',
      recipe: 'Crush 500g green chili + 500g garlic + 5kg neem leaves in 10L cow urine. Boil for 30 minutes, cool and strain.',
      ingredients: ['Hot Green Chilies', 'Garlic paste', 'Neem leaves', 'Desi cow urine'],
      mixingRatio: '20 ml per Liter water (300 ml in 15L pump)',
      preparationTime: '1 day',
      applicationMethod: 'Foliar spray under side of leaves where sucking pests hide.'
    },
    bestSprayingTime: {
      timeOfDay: 'late_evening',
      recommendedHours: '5:00 PM to 6:45 PM',
      reason: 'Thrips and whiteflies reside on leaf undersides and become active at dusk.',
      maxTemperatureC: 34,
      minWindSpeedKmh: 3,
      maxWindSpeedKmh: 12
    },
    weatherRisk: {
      safeToSpray: true,
      riskLevel: 'safe',
      rainRiskAlert: 'No rain forecast.',
      heatSpikeAlert: 'Heat wave active (38°C) - Thrips reproduction accelerated!',
      windDriftAlert: 'Calm evening breeze 4 km/h.',
      mainRecommendation: 'Spray underneath leaves at 5:30 PM with fine mist.'
    },
    preventionTips: [
      'Install yellow sticky traps (for whiteflies) and blue sticky traps (for thrips) @ 25 traps/acre.',
      'Grow 2 rows of maize or sorghum as border barrier crop.',
      'Remove and burn severely distorted infected virus plants.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    audioSummaryText: 'Chili Leaf Curl and Sucking Pests identified. Control vector insects with Diafenthiuron 1.2 spoons per pump. Spray undersides in evening.',
    source: 'gemini-ai'
  },
  {
    id: 'scan-corn-fall-armyworm',
    cropName: 'Corn (Maize)',
    diseaseOrPestName: 'Fall Armyworm (Spodoptera frugiperda)',
    scientificName: 'Spodoptera frugiperda',
    pathogenType: 'pest',
    infectionStage: 'intermediate',
    spreadRisk: 'high',
    yieldLossRiskPercent: 60,
    severity: 'severe',
    confidenceScore: 95,
    affectedParts: ['Whorl leaves', 'Central tassel', 'Developing corn cobs'],
    transmissionMethod: 'Nocturnal moths laying scale-covered egg masses on whorl leaves; aggressive chewing larvae feed deep within central whorls',
    favorableConditions: {
      humidity: '60% - 80% RH',
      tempRange: '26°C - 34°C',
      triggerFactors: ['Staggered sowing in neighboring plots', 'High nitrogen fertilization causing soft lush foliage']
    },
    visualSigns: [
      'Extensive ragged windowpane pinholes and large chewed leaf margins',
      'Heavy moist sawdust-like fecal frass accumulated inside leaf whorls',
      'Caterpillar with inverted Y mark on head and 4 square spots on 8th segment'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Spodoptera_frugiperda.jpg',
    symptoms: [
      'Ragged leaf holes and chewed whorls',
      'Abundant sawdust-like frass inside central funnel',
      'Bored holes at ear base causing cob rotting'
    ],
    causes: [
      'Warm humid weather favoring rapid moth oviposition',
      'Late planted maize crops'
    ],
    chemicalTreatment: {
      name: 'Chlorantraniliprole 18.5% SC (Coragen)',
      activeIngredient: 'Chlorantraniliprole 18.5% SC',
      tradeNames: ['Coragen', 'Cover', 'Cosko'],
      dosagePerLiter: '0.4 ml per Liter of water',
      spoonsPer15LPump: 0.4, // 6 ml in 15L pump
      mlOrGramsPerLiter: 0.4,
      unitType: 'ml',
      maxSpraysPerSeason: 2,
      waitingPeriodDays: 14,
      safetyGear: ['mask', 'gloves', 'goggles', 'long_sleeves'],
      estimatedCost: '₹480 per 60ml bottle'
    },
    organicTreatment: {
      name: 'Sand + Lime (9:1) Whorl Application + Metarhizium rileyi',
      recipe: 'Mix 9 parts dry sieved sand + 1 part slaked lime. Drop a pinch into each central whorl. Alternatively spray Metarhizium rileyi bio-fungus @ 5g/L.',
      ingredients: ['Fine river sand', 'Slaked lime (Chuna)', 'Metarhizium rileyi culture'],
      mixingRatio: '5g bio-agent / Liter of water',
      preparationTime: '15 minutes',
      applicationMethod: 'Direct nozzle spray into central whorls.'
    },
    bestSprayingTime: {
      timeOfDay: 'late_evening',
      recommendedHours: '5:00 PM to 7:00 PM',
      reason: 'Caterpillars emerge from deep whorl funnels to feed at nightfall.',
      maxTemperatureC: 32,
      minWindSpeedKmh: 2,
      maxWindSpeedKmh: 10
    },
    weatherRisk: {
      safeToSpray: true,
      riskLevel: 'safe',
      rainRiskAlert: 'No rain forecast. Safe to spray.',
      heatSpikeAlert: 'Moderate conditions.',
      windDriftAlert: 'Low wind.',
      mainRecommendation: 'Target the spray directly into the central whorls at dusk.'
    },
    preventionTips: [
      'Erect bird perches @ 10-15 per acre to invite insectivorous birds.',
      'Apply sand-lime mixture into whorls at 15-20 days after germination.',
      'Intercrop with Desmodium or Cowpea to repel moths.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    audioSummaryText: 'Fall Armyworm attack on Corn. Apply Chlorantraniliprole at 6 ml per 15-liter pump directed into the central whorls in the evening.',
    source: 'gemini-ai'
  },
  {
    id: 'scan-potato-late-blight',
    cropName: 'Potato',
    diseaseOrPestName: 'Late Blight (Phytophthora infestans)',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'fungal',
    infectionStage: 'advanced',
    spreadRisk: 'high',
    yieldLossRiskPercent: 75,
    severity: 'severe',
    confidenceScore: 97,
    affectedParts: ['Leaf tips and margins', 'Stems and petioles', 'Underground potato tubers'],
    transmissionMethod: 'Windborne and rain-splashed zoosporangia; high water mobility in cool wet soil infecting tubers',
    favorableConditions: {
      humidity: '>90% RH with persistent dense fog and overcast sky',
      tempRange: '12°C - 20°C',
      triggerFactors: ['Relative humidity >90% for 48 hours with temperatures between 10-20°C (Smith Periods)']
    },
    visualSigns: [
      'Water-soaked dark brown to purplish-black blighted spots at leaf tips',
      'White cottony fungal downy growth on the underside of leaves during morning dew',
      'Foul smell from decaying rotting canopy in severe field outbreaks'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Late_blight_on_potato_leaf_2.jpg',
    symptoms: [
      'Irregular water-soaked brown patches at leaf tips',
      'White mildew growth on lower leaf surfaces under high moisture',
      'Brown rotting dry patches on tuber flesh beneath the skin'
    ],
    causes: [
      'Cool temperatures (12-20°C) with persistent fog or drizzle',
      'Infected seed tubers carrying dormant mycelium'
    ],
    chemicalTreatment: {
      name: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate M-8)',
      activeIngredient: 'Cymoxanil 8% + Mancozeb 64% WP',
      tradeNames: ['Curzate M-8', 'Sector', 'Moximate'],
      dosagePerLiter: '2.0 grams per Liter of water',
      spoonsPer15LPump: 2.0, // 30 grams per 15L pump
      mlOrGramsPerLiter: 2.0,
      unitType: 'grams',
      maxSpraysPerSeason: 3,
      waitingPeriodDays: 7,
      safetyGear: ['mask', 'gloves', 'goggles', 'long_sleeves'],
      estimatedCost: '₹390 per 500g pack'
    },
    organicTreatment: {
      name: 'Trichoderma harzianum + Copper Hydroxide Bio-Wash',
      recipe: 'Foliar spray Trichoderma harzianum bio-culture @ 5g/L or Bordeaux Mixture 1%.',
      ingredients: ['Trichoderma harzianum', 'Copper Sulphate', 'Hydrated Lime'],
      mixingRatio: '5g / Liter of water',
      preparationTime: '20 minutes',
      applicationMethod: 'Complete coverage of foliage including leaf undersides.'
    },
    bestSprayingTime: {
      timeOfDay: 'early_morning',
      recommendedHours: '7:30 AM to 10:00 AM',
      reason: 'Arrests zoospore germination before afternoon temperature rises.',
      maxTemperatureC: 22,
      minWindSpeedKmh: 2,
      maxWindSpeedKmh: 10
    },
    weatherRisk: {
      safeToSpray: true,
      riskLevel: 'caution',
      rainRiskAlert: 'High humidity and light drizzle risk. Spray systemic fungicide promptly.',
      heatSpikeAlert: 'Low temperature favors blight spread.',
      windDriftAlert: 'Moderate wind.',
      mainRecommendation: 'Immediate curative spray with Curzate M-8 required.'
    },
    preventionTips: [
      'Use certified disease-free seed tubers treated with Mancozeb.',
      'High earthing up to protect tubers from swimming zoospores.',
      'Destroy volunteer potato plants and dump piles.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    audioSummaryText: 'Severe Potato Late Blight detected. Spray Cymoxanil + Mancozeb at 2 spoons per 15-liter pump immediately to prevent total crop loss.',
    source: 'gemini-ai'
  },
  {
    id: 'scan-onion-purple-blotch',
    cropName: 'Onion',
    diseaseOrPestName: 'Purple Blotch & Thrips Complex',
    scientificName: 'Alternaria porri & Thrips tabaci',
    pathogenType: 'fungal',
    infectionStage: 'intermediate',
    spreadRisk: 'high',
    yieldLossRiskPercent: 45,
    severity: 'moderate',
    confidenceScore: 92,
    affectedParts: ['Hollow cylindrical leaves', 'Seed stalks (scapes)'],
    transmissionMethod: 'Airborne fungal conidia penetrating through thrips rasping puncture wounds and stomata',
    favorableConditions: {
      humidity: '>80% RH',
      tempRange: '25°C - 30°C',
      triggerFactors: ['Dense planting with high weed density', 'Overhead sprinkler irrigation wetting tubular leaves']
    },
    visualSigns: [
      'Small water-soaked sunken lesions developing purple or dark violet centers',
      'Concentric zones of dark sporulation with yellowish chlorotic borders',
      'Seed stalks snapping and falling over at lesion sites'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Alternaria_porri_%28396462144%29.jpg',
    symptoms: [
      'Purplish-brown sunken spots with yellow halos on tubular leaves',
      'Leaves collapsing from the middle and drying from tips downwards',
      'Silvery streaks from Thrips feeding'
    ],
    causes: [
      'Thrips puncture wounds acting as infection entry ports',
      'Warm humid weather with persistent leaf wetness'
    ],
    chemicalTreatment: {
      name: 'Tebuconazole 25.9% EC (Folicur) + Sticker',
      activeIngredient: 'Tebuconazole 25.9% EC',
      tradeNames: ['Folicur', 'Orius', 'Custodia'],
      dosagePerLiter: '1.0 ml per Liter of water + 0.5 ml sticker (Spreader)',
      spoonsPer15LPump: 1.0, // 15 ml in 15L pump
      mlOrGramsPerLiter: 1.0,
      unitType: 'ml',
      maxSpraysPerSeason: 2,
      waitingPeriodDays: 10,
      safetyGear: ['mask', 'gloves', 'goggles', 'long_sleeves'],
      estimatedCost: '₹360 per 250ml bottle'
    },
    organicTreatment: {
      name: 'Neem Oil (10,000 ppm) + Trichoderma viride',
      recipe: 'Mix 5ml cold pressed neem oil + 5g Trichoderma viride per Liter water with 1g soap as wetting agent.',
      ingredients: ['Neem Oil', 'Trichoderma viride bio-fungicide', 'Natural sticker soap'],
      mixingRatio: '5 ml + 5g per Liter of water',
      preparationTime: '15 minutes',
      applicationMethod: 'Ensure thorough wetting of waxy cylindrical onion leaves.'
    },
    bestSprayingTime: {
      timeOfDay: 'late_evening',
      recommendedHours: '4:30 PM to 6:30 PM',
      reason: 'Onion leaves have a waxy cuticle; evening spraying with sticker prevents spray runoff.',
      maxTemperatureC: 32,
      minWindSpeedKmh: 2,
      maxWindSpeedKmh: 10
    },
    weatherRisk: {
      safeToSpray: true,
      riskLevel: 'safe',
      rainRiskAlert: 'Dry weather forecast.',
      heatSpikeAlert: 'Warm weather speeds up purple blotch sporulation.',
      windDriftAlert: 'Gentle breeze.',
      mainRecommendation: 'Add an agricultural sticker/spreader to the spray solution for waxy onion leaves.'
    },
    preventionTips: [
      'Always add a wetting agent/sticker (like Sandovit or Apsa-80) due to waxy onion foliage.',
      'Control onion thrips early with blue sticky traps.',
      'Maintain 15cm row spacing for good air movement.'
    ],
    scannedAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    audioSummaryText: 'Onion Purple Blotch identified. Spray Tebuconazole at 15 ml per pump with an agricultural sticker in the evening.',
    source: 'gemini-ai'
  }
];

export const initialDiaryEntries: FarmDiaryEntry[] = [
  {
    id: 'diary-001',
    userId: 'farmer-001',
    cropName: 'Tomato',
    plotName: 'East Field (Plot A - 1.5 Acre)',
    activityType: 'planting',
    imageUrl: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&auto=format&fit=crop&q=80',
    date: '2026-08-10',
    time: '07:30 AM',
    notes: 'Transplanted 4,500 hybrid tomato saplings (Abhinav variety). Applied 50kg DAP + 25kg Potash in basal furrow.',
    quantity: 4500,
    unit: 'saplings',
    chemicalUsed: 'DAP 18:46 + MOP',
    cost: 4800,
    status: 'completed',
    createdAt: '2026-08-10T08:00:00.000Z'
  },
  {
    id: 'diary-002',
    userId: 'farmer-001',
    cropName: 'Tomato',
    plotName: 'East Field (Plot A - 1.5 Acre)',
    activityType: 'watering',
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80',
    date: '2026-08-18',
    time: '06:00 AM',
    notes: 'Drip irrigation run for 3 hours. Watered with 19:19:19 water soluble fertilizer through venturi injector.',
    quantity: 3,
    unit: 'hours drip',
    status: 'completed',
    createdAt: '2026-08-18T09:30:00.000Z'
  },
  {
    id: 'diary-003',
    userId: 'farmer-001',
    cropName: 'Tomato',
    plotName: 'East Field (Plot A - 1.5 Acre)',
    activityType: 'pest_sighting',
    date: '2026-08-28',
    time: '04:15 PM',
    notes: 'Spotted target board spots on lower leaves after humid nights. Ran KrishiVeyra Photo Scanner - Early Blight detected.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Alternaria_solani_-_leaf_lesions.jpg',
    diseaseScanId: 'scan-tomato-early-blight',
    status: 'completed',
    createdAt: '2026-08-28T16:30:00.000Z'
  },
  {
    id: 'diary-004',
    userId: 'farmer-001',
    cropName: 'Cotton',
    plotName: 'North Field (Plot B - 2 Acres)',
    activityType: 'fertilizer',
    imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&auto=format&fit=crop&q=80',
    date: '2026-08-25',
    time: '08:00 AM',
    notes: 'Top dressing with Urea 45kg bag + 10kg Zinc Sulphate per acre before flowering stage.',
    quantity: 90,
    unit: 'kg',
    chemicalUsed: 'Neem Coated Urea + Zinc',
    cost: 1100,
    status: 'completed',
    createdAt: '2026-08-25T08:30:00.000Z'
  }
];

export const agronomistExperts: AgronomistExpert[] = [
  {
    id: 'exp-01',
    name: 'Dr. Ramesh Sharma',
    title: 'Senior Plant Pathologist & KVK Head',
    specialization: 'Vegetables & Cotton Diseases (IPM Specialist)',
    experienceYears: 18,
    languages: ['Hindi', 'English', 'Marathi', 'Punjabi'],
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    phoneContact: '+91 1800 180 1551',
    isOnline: true,
    verifiedKVK: true
  },
  {
    id: 'exp-02',
    name: 'Dr. Ananya Sengupta',
    title: 'Chief Entomologist, Agri University',
    specialization: 'Pest Identification, Biological Controls & Soil Health',
    experienceYears: 14,
    languages: ['Bengali', 'Hindi', 'English', 'Odia'],
    rating: 4.8,
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    phoneContact: '+91 1800 180 1551',
    isOnline: true,
    verifiedKVK: true
  },
  {
    id: 'exp-03',
    name: 'Er. Venkat Rao',
    title: 'Horticulture Agronomist & Micro-Irrigation Advisor',
    specialization: 'Chili, Onion, Paddy Nutrition & Fertigation',
    experienceYears: 12,
    languages: ['Telugu', 'Hindi', 'English', 'Kannada'],
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop&q=80',
    phoneContact: '+91 1800 180 1551',
    isOnline: false,
    verifiedKVK: true
  }
];

export const initialWeatherState: CurrentWeatherState = {
  temperature: 32,
  humidity: 68,
  windSpeedKmh: 8,
  rainProbabilityNext4h: 15,
  isHeatWaveRisk: false,
  isRainImminent: false,
  condition: 'Partly Cloudy',
  locationName: 'Nashik District Farm Zone',
  dangerAlerts: [
    {
      type: 'optimal_spray',
      severity: 'info',
      title: 'Optimal Evening Spray Window Available',
      description: 'Wind speeds below 10 km/h with dry conditions until midnight. Ideal time: 4:30 PM - 6:30 PM.',
      actionNeeded: 'Prepare spray tank solution before 4:00 PM.'
    },
    {
      type: 'heat_pest_spike',
      severity: 'warning',
      title: 'Heat Warning for Wednesday (>38°C)',
      description: 'Upcoming temperature spike will accelerate Thrips & Whitefly life cycles by 40%.',
      actionNeeded: 'Check yellow/blue sticky traps and irrigate root zone.'
    }
  ],
  forecast: [
    {
      day: 'Today',
      date: 'Aug 30',
      tempMax: 33,
      tempMin: 22,
      humidity: 68,
      rainProbability: 15,
      windSpeedKmh: 8,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      spraySuitability: 'excellent',
      sprayAdvice: 'Ideal for evening spraying between 4:30 PM and 6:30 PM.'
    },
    {
      day: 'Tomorrow',
      date: 'Aug 31',
      tempMax: 34,
      tempMin: 23,
      humidity: 62,
      rainProbability: 20,
      windSpeedKmh: 9,
      condition: 'Sunny',
      icon: 'sun',
      spraySuitability: 'excellent',
      sprayAdvice: 'Good spray conditions early morning or late evening.'
    },
    {
      day: 'Monday',
      date: 'Sep 1',
      tempMax: 30,
      tempMin: 21,
      humidity: 88,
      rainProbability: 85,
      windSpeedKmh: 24,
      condition: 'Heavy Rain',
      icon: 'rain',
      spraySuitability: 'danger',
      sprayAdvice: 'DO NOT SPRAY! Heavy downpour will wash all medicine away.'
    },
    {
      day: 'Tuesday',
      date: 'Sep 2',
      tempMax: 29,
      tempMin: 20,
      humidity: 82,
      rainProbability: 60,
      windSpeedKmh: 18,
      condition: 'Light Rain',
      icon: 'rain',
      spraySuitability: 'poor',
      sprayAdvice: 'Intermittent drizzles. Postpone pesticide sprays.'
    },
    {
      day: 'Wednesday',
      date: 'Sep 3',
      tempMax: 38,
      tempMin: 24,
      humidity: 45,
      rainProbability: 5,
      windSpeedKmh: 12,
      condition: 'Sunny',
      icon: 'sun',
      spraySuitability: 'moderate',
      sprayAdvice: 'Heat spike! Only spray after 5:30 PM when sun goes down.'
    },
    {
      day: 'Thursday',
      date: 'Sep 4',
      tempMax: 36,
      tempMin: 23,
      humidity: 50,
      rainProbability: 10,
      windSpeedKmh: 10,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      spraySuitability: 'excellent',
      sprayAdvice: 'Favorable morning and evening spray conditions.'
    },
    {
      day: 'Friday',
      date: 'Sep 5',
      tempMax: 33,
      tempMin: 22,
      humidity: 65,
      rainProbability: 25,
      windSpeedKmh: 11,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      spraySuitability: 'excellent',
      sprayAdvice: 'Safe for foliar fertilizers and bio-pesticides.'
    }
  ]
};
