export type ActiveTab = 'electric-picnic' | 'leixlip-local' | 'grand-o-meter' | 'drying-index' | 'glossary' | 'ask-guy';

export interface WeatherMetric {
  label: string;
  value: string;
  subtext?: string;
  status: 'good' | 'moderate' | 'warning' | 'grand';
}

export interface EPForecastDay {
  date: string;
  dayName: string;
  phase: string;
  tempDay: number;
  tempNight: number;
  rainfallMm: number;
  rainProbability: number;
  windSpeedKmh: number;
  windGustsKmh: number;
  officialModelPrediction: string;
  ecmwfModel: string;
  gfsModel: string;
  metEireannNote: string;
  mudIndex: 'Dusty & Dry' | 'Soft Ground' | 'Squishy' | 'Welly Deep' | 'Full Bog Snorkel';
  mudPercentage: number;
  localIrishVerdict: string;
  essentialGear: string[];
  recommendedStage: string;
  vibeSummary: string;
}

export interface EPHistoricalYear {
  year: number;
  overallVerdict: 'Scorcher' | 'Soft & Pleasant' | 'Mixed Bag' | 'Soggy' | 'Biblical Mud Bath';
  tempMax: number;
  rainfallTotalMm: number;
  mudRating: number; // 1 - 10
  headlineMemories: string;
  welliesRequired: boolean;
  sunburnReported: boolean;
  quote: string;
}

export interface ForecastModelComparison {
  name: string;
  provider: string;
  prediction: string;
  rainEstimate: string;
  tempRange: string;
  confidence: string;
  leixlipCritique: string;
  iconName: string;
}

export interface LeixlipSpotWeather {
  name: string;
  landmark: string;
  currentTemp: number;
  condition: string;
  windNote: string;
  dryingStatus: string;
  funFact: string;
}

export interface IrishGlossaryTerm {
  term: string;
  phonetic: string;
  literalMeaning: string;
  actualIrishMeaning: string;
  meteorologicalCategory: 'Rain' | 'Temperature' | 'Wind' | 'General Vibe' | 'Laundry';
  exampleUsage: string;
  leixlipContext: string;
}
