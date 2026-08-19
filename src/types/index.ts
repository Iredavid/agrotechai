export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  forecast: { day: string; temp: number; condition: string }[];
}

export interface Task {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'planting' | 'harvesting' | 'maintenance' | 'treatment';
}

export interface FarmHealth {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    soilMoisture: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
  }
}

export interface CropInsight {
  crop: string;
  suitability: number;
  expectedYield: string;
  timeToHarvest: string;
  marketDemand: 'high' | 'medium' | 'low';
}

export interface MarketPrice {
  commodity: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}
