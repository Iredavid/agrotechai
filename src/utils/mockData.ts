import type { Task, MarketPrice } from "../types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Apply NPK Fertilizer",
    date: "Today",
    status: "pending",
    type: "treatment",
  },
  {
    id: "2",
    title: "Irrigate Maize Field A",
    date: "Today",
    status: "in-progress",
    type: "maintenance",
  },
  {
    id: "3",
    title: "Inspect for Fall Armyworm",
    date: "Tomorrow",
    status: "pending",
    type: "maintenance",
  },
  {
    id: "4",
    title: "Harvest Cassava Plot 2",
    date: "Next Week",
    status: "pending",
    type: "harvesting",
  },
];

export const mockMarket: MarketPrice[] = [
  {
    commodity: "Maize (White)",
    price: 450000,
    unit: "per ton",
    trend: "up",
    change: 2.5,
  },
  {
    commodity: "Cassava Tubers",
    price: 120000,
    unit: "per ton",
    trend: "stable",
    change: 0,
  },
  {
    commodity: "Soybeans",
    price: 650000,
    unit: "per ton",
    trend: "up",
    change: 4.2,
  },
  {
    commodity: "Rice (Paddy)",
    price: 480000,
    unit: "per ton",
    trend: "down",
    change: -1.5,
  },
];

export const recentActivity = [
  {
    id: "1",
    title: "Weather Alert",
    description: "Heavy rain expected tomorrow. Delay spraying.",
    time: "2h ago",
    type: "alert",
  },
  {
    id: "2",
    title: "Market Update",
    description: "Maize prices hit new 3-month high.",
    time: "5h ago",
    type: "info",
  },
  {
    id: "3",
    title: "Task Completed",
    description: "Soil testing for Plot B finished.",
    time: "1d ago",
    type: "success",
  },
];
