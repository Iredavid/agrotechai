export async function getWeather(latitude: number, longitude: number) {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

  console.log(longitude, latitude);

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/currentweather`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lon: longitude,
      lat: latitude,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.status}`);
  }

  const weatherData = await response.json();

  const data = weatherData;
  console.log(data);
  return data;
}

export async function forecast(latitude: number, longitude: number) {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

  console.log(longitude, latitude);

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forecast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lon: longitude,
      lat: latitude,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.status}`);
  }

  const weatherData = await response.json();

  const data = weatherData;
  console.log(data);
  return data;
}

export async function getUserData(userId?: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/getUserData?userId=${encodeURIComponent(userId ?? "")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = response.json();
  return data;
}

export function formatLabel(value: string): string {
  if (!value) return "";

  return value
    .replace(/[_-]+/g, " ")        // underscores/hyphens -> spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase -> split words
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
