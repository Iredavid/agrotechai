export interface Task {
  id: string;
  title: string;
  date: string;
  status: "pending" | "in-progress" | "completed";
  type: "planting" | "harvesting" | "maintenance" | "treatment";
}

export interface MarketPrice {
  commodity: string;
  price: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
}
