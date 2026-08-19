import type { WeatherData, Task, FarmHealth, CropInsight, MarketPrice } from '../types';

export const mockWeather: WeatherData = {
  temperature: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  precipitation: 10,
  windSpeed: 12,
  forecast: [
    { day: 'Mon', temp: 29, condition: 'Sunny' },
    { day: 'Tue', temp: 28, condition: 'Partly Cloudy' },
    { day: 'Wed', temp: 26, condition: 'Rain' },
    { day: 'Thu', temp: 27, condition: 'Clear' },
    { day: 'Fri', temp: 29, condition: 'Sunny' },
  ],
};

export const mockTasks: Task[] = [
  { id: '1', title: 'Apply NPK Fertilizer', date: 'Today', status: 'pending', type: 'treatment' },
  { id: '2', title: 'Irrigate Maize Field A', date: 'Today', status: 'in-progress', type: 'maintenance' },
  { id: '3', title: 'Inspect for Fall Armyworm', date: 'Tomorrow', status: 'pending', type: 'maintenance' },
  { id: '4', title: 'Harvest Cassava Plot 2', date: 'Next Week', status: 'pending', type: 'harvesting' },
];

export const mockHealth: FarmHealth = {
  score: 85,
  status: 'excellent',
  metrics: {
    soilMoisture: 42,
    nitrogen: 65,
    phosphorus: 45,
    potassium: 50,
    ph: 6.5,
  }
};

export const mockInsights: CropInsight[] = [
  { crop: 'Maize', suitability: 92, expectedYield: '4.5 tons/ha', timeToHarvest: '120 days', marketDemand: 'high' },
  { crop: 'Cassava', suitability: 88, expectedYield: '15 tons/ha', timeToHarvest: '9 months', marketDemand: 'high' },
  { crop: 'Soybeans', suitability: 75, expectedYield: '2.1 tons/ha', timeToHarvest: '100 days', marketDemand: 'medium' },
];

export const mockMarket: MarketPrice[] = [
  { commodity: 'Maize (White)', price: 450000, unit: 'per ton', trend: 'up', change: 2.5 },
  { commodity: 'Cassava Tubers', price: 120000, unit: 'per ton', trend: 'stable', change: 0 },
  { commodity: 'Soybeans', price: 650000, unit: 'per ton', trend: 'up', change: 4.2 },
  { commodity: 'Rice (Paddy)', price: 480000, unit: 'per ton', trend: 'down', change: -1.5 },
];

export const recentActivity = [
  { id: '1', title: 'Weather Alert', description: 'Heavy rain expected tomorrow. Delay spraying.', time: '2h ago', type: 'alert' },
  { id: '2', title: 'Market Update', description: 'Maize prices hit new 3-month high.', time: '5h ago', type: 'info' },
  { id: '3', title: 'Task Completed', description: 'Soil testing for Plot B finished.', time: '1d ago', type: 'success' },
];
