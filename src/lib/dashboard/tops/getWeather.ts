export interface WeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainMetrics;
  visibility: number;
  wind: Wind;
  rain?: Rain; // Optional as it only appears during rain
  clouds: Clouds;
  dt: number;
  sys: SystemInfo;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Coordinates {
  lon: number;
  lat: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainMetrics {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Rain {
  "1h": number;
}

export interface Clouds {
  all: number;
}

export interface SystemInfo {
  country: string;
  sunrise: number;
  sunset: number;
}

export default async function getWeather({
  latitude,
  longitude,
}: {
  latitude: string | undefined;
  longitude: string | undefined;
}) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric&lang=id`,
  );

  const data: WeatherResponse = await response.json();

  return data;
}
