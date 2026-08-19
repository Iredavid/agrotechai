export async function getWeather(latitude: number, longitude: number) {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

  console.log(longitude, latitude);

  const response = await fetch("http://127.0.0.1:8000/currentweather", {
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

  const response = await fetch("http://127.0.0.1:8000/forecast", {
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
    `http://127.0.0.1:8000/getUserData?userId=${encodeURIComponent(userId ?? "")}`,
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
