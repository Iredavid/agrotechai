export async function getData(path: string) {
  const response = await fetch(`http://127.0.0.1:8000/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = response.json();
  return data;
}

export const getCoordinates = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  });
};

export async function getLongLat(state: string): Promise<{
  latitude: number;
  longitude: number;
}> {
  const response = await fetch("http://127.0.0.1:8000/geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: state,
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
