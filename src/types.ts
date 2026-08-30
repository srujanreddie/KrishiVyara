export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'te' | 'bn' | 'es' | 'sw';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  farmSizeAcres: number;
  soilType: 'clay' | 'loam' | 'sandy' | 'black' | 'red' | 'alluvial';
  primaryCrops: string[];
  languagePreference: LanguageCode;
  highContrastMode: boolean;
  largeFontMode: boolean;
  voiceAutoRead: boolean;
  avatarUrl?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracyMeters?: number;
  lastLocationUpdated?: string;
  locationAutoDetected?: boolean;
}

export type ActivityType = 
  | 'planting'
  | 'watering'
  | 'fertilizer'
  | 'pesticide'
  | 'weeding'
  | 'harvest'
  | 'pest_sighting'
  | 'soil_treatment'
  | 'note';

export interface FarmDiaryEntry {
  id: string;
  userId: string;
  cropName: string;
  plotName: string;
  activityType: ActivityType;
  date: string;
  time?: string;
  notes: string;
  quantity?: number;
  unit?: string;
  chemicalUsed?: string;
  cost?: number;
  imageUrl?: string;
  diseaseScanId?: string;
  status: 'completed' | 'scheduled' | 'delayed';
  createdAt: string;
}

export type SeverityLevel = 'low' | 'moderate' | 'severe';
export type PathogenType = 'fungal' | 'bacterial' | 'viral' | 'pest' | 'nematode' | 'deficiency';
export type InfectionStage = 'early' | 'intermediate' | 'advanced';
export type SpreadRiskLevel = 'high' | 'moderate' | 'low';

export interface ChemicalMedicine {
  name: string;
  activeIngredient: string;
  tradeNames: string[];
  dosagePerLiter: string;
  spoonsPer15LPump: number; // Knapsack sprayer estimation
  mlOrGramsPerLiter: number;
  unitType: 'ml' | 'grams' | 'spoons';
  maxSpraysPerSeason: number;
  waitingPeriodDays: number; // Harvest safety period (PHI)
  safetyGear: ('gloves' | 'mask' | 'goggles' | 'boots' | 'long_sleeves')[];
  estimatedCost: string;
}

export interface OrganicMedicine {
  name: string;
  recipe: string;
  ingredients: string[];
  mixingRatio: string;
  preparationTime: string;
  applicationMethod: string;
}

export interface SprayingTimeGuide {
  timeOfDay: 'early_morning' | 'late_evening' | 'do_not_spray';
  recommendedHours: string;
  reason: string;
  maxTemperatureC: number;
  minWindSpeedKmh: number;
  maxWindSpeedKmh: number;
}

export interface WeatherRiskAssessment {
  safeToSpray: boolean;
  riskLevel: 'safe' | 'caution' | 'danger';
  rainRiskAlert: string;
  heatSpikeAlert: string;
  windDriftAlert: string;
  mainRecommendation: string;
}

export interface FavorableConditions {
  humidity: string;
  tempRange: string;
  triggerFactors: string[];
}

export interface CropScanResult {
  id: string;
  cropName: string;
  diseaseOrPestName: string;
  scientificName?: string;
  pathogenType?: PathogenType;
  infectionStage?: InfectionStage;
  spreadRisk?: SpreadRiskLevel;
  yieldLossRiskPercent?: number;
  affectedParts?: string[];
  transmissionMethod?: string;
  favorableConditions?: FavorableConditions;
  visualSigns?: string[];
  severity: SeverityLevel;
  confidenceScore: number;
  symptoms: string[];
  causes: string[];
  chemicalTreatment: ChemicalMedicine;
  organicTreatment: OrganicMedicine;
  bestSprayingTime: SprayingTimeGuide;
  weatherRisk: WeatherRiskAssessment;
  preventionTips: string[];
  scannedAt: string;
  imageUrl?: string;
  audioSummaryText?: string;
  source?: 'gemini-ai' | 'agro-knowledge-engine';
}

export interface ExpertChatMessage {
  id: string;
  sender: 'farmer' | 'expert' | 'system';
  text: string;
  audioUrl?: string;
  imageUrl?: string;
  timestamp: string;
  isVoiceNote?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface AgronomistExpert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  avatarUrl: string;
  phoneContact: string;
  isOnline: boolean;
  verifiedKVK: boolean;
}

export interface WeatherForecastDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbability: number;
  windSpeedKmh: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Thunderstorm';
  icon: string;
  spraySuitability: 'excellent' | 'moderate' | 'poor' | 'danger';
  sprayAdvice: string;
}

export interface CurrentWeatherState {
  temperature: number;
  humidity: number;
  windSpeedKmh: number;
  rainProbabilityNext4h: number;
  isHeatWaveRisk: boolean;
  isRainImminent: boolean;
  condition: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  locationAccuracyMeters?: number;
  isAutoDetected?: boolean;
  lastUpdatedTime?: string;
  dangerAlerts: {
    type: 'rain_wash' | 'heat_pest_spike' | 'high_wind' | 'optimal_spray';
    severity: 'info' | 'warning' | 'danger';
    title: string;
    description: string;
    actionNeeded: string;
  }[];
  forecast: WeatherForecastDay[];
}
