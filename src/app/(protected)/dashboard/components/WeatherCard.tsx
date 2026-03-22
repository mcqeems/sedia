"use client";

import { IconDroplet, IconThermometer, IconWind } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import getWeather, {
  type WeatherResponse,
} from "@/lib/dashboard/tops/getWeather";

const weatherTranslations: Record<string, string> = {
  Thunderstorm: "Badai Petir",
  Drizzle: "Gerimis",
  Rain: "Hujan",
  Snow: "Salju",
  Atmosphere: "Atmosfer",
  Mist: "Kabut",
  Smoke: "Asap",
  Haze: "Udara Kabur",
  Dust: "Debu",
  Fog: "Kabut Tebal",
  Sand: "Pasir",
  Ash: "Abu Vulkanik",
  Squall: "Angin Kencang",
  Tornado: "Tornado",
  Clear: "Cerah",
  Clouds: "Berawan",
};

export default function WeatherCard() {
  const { dispatch, state } = useDashContext();
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    const response = async () => {
      if (state.state.latitude && state.state.longitude) {
        const weather = await getWeather({
          latitude: state.state.latitude,
          longitude: state.state.longitude,
        });
        setWeatherData(weather);
        dispatch({ type: "SET_STATUS", payload: { loadingWeather: false } });
      }
    };
    response();
  }, [state.state.latitude, state.state.longitude, dispatch]);

  if (state.status.loadingWeather) {
    return (
      <div className="flex w-full min-h-[250px] sm:min-h-[125px] rounded-lg shadow-xl bg-primary/50 overflow-hidden">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="text-white bg-primary flex flex-col sm:flex-row items-stretch justify-between min-h-[125px] rounded-lg shadow-xl overflow-hidden">
      {/* <!-- Kiri: Info Lokasi & Waktu --> */}
      <div className="flex flex-row justify-between md:hidden">
        <div className="relative z-10 flex-1 p-4 flex flex-col justify-center ">
          <p className="text-xs text-blue-100/70 mb-1">Cuaca Hari Ini</p>
          <h2 id="city-name" className="text-lg font-bold truncate">
            {weatherData?.weather[0].main
              ? weatherTranslations[weatherData.weather[0].main] ||
                weatherData.weather[0].main
              : ""}
          </h2>

          <div className="mt-auto flex justify-center items-center p-1 md:p-2 rounded-full bg-black/20 uppercase">
            <span className="text-[10px] text-center font-bold">
              {weatherData?.weather[0].description}
            </span>
          </div>
        </div>
        <div className="relative z-10 flex-[1.2] p-4 flex items-center justify-center gap-2">
          <div className="flex items-center">
            <Image
              src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
              alt="weather icon"
              height={75}
              width={75}
              className="drop-shadow-lg"
            />
            <div className="flex items-start">
              <span
                id="temp-main"
                className="md:text-4xl text-2xl font-black tracking-tighter"
              >
                {weatherData?.main.temp}
              </span>
              <span className="text-xl font-bold mt-1 ml-0.5">°C</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 flex-1 p-4 md:flex hidden flex-col justify-center bg-background/15 border-r border border-background/25">
        <p id="date-string" className="text-xs text-blue-100/70 mb-1">
          Cuaca Hari Ini
        </p>
        <h2 id="city-name" className="text-lg font-bold truncate">
          {weatherData?.weather[0].main
            ? weatherTranslations[weatherData.weather[0].main] ||
              weatherData.weather[0].main
            : ""}
        </h2>

        <div className="mt-auto">
          <span
            id="weather-desc"
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/20 uppercase tracking-wider"
          >
            {weatherData?.weather[0].description}
          </span>
        </div>
      </div>

      {/* <!-- Tengah: Suhu Utama & Ikon --> */}
      <div className="relative z-10 flex-[1.2] p-4 hidden md:flex items-center justify-center gap-2">
        <div className="flex items-center">
          <Image
            src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
            alt="weather icon"
            height={75}
            width={75}
            className="drop-shadow-lg"
          />
          <div className="flex items-start">
            <span
              id="temp-main"
              className="md:text-4xl text-2xl font-black tracking-tighter"
            >
              {weatherData?.main.temp}
            </span>
            <span className="text-xl font-bold mt-1 ml-0.5">°C</span>
          </div>
        </div>
      </div>

      {/* <!-- Kanan: Suhu Detail --> */}
      <div className="relative z-10 md:pl-10 p-2 flex flex-row sm:flex-col justify-around sm:justify-center gap-3 bg-black/10 sm:bg-transparent sm:min-w-[145px]">
        <div className="flex items-center gap-2 sm:px-2">
          <div className="opacity-70">
            <IconDroplet className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-bold opacity-70 leading-none">
              Kelembapan
            </span>
            <span id="humidity" className="text-xs font-semibold leading-tight">
              {weatherData?.main.humidity}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:px-2">
          <div className="opacity-70">
            <IconWind className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-bold opacity-70 leading-none">
              Angin
            </span>
            <span id="wind" className="text-xs font-semibold leading-tight">
              {weatherData?.wind.speed} km/j
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:px-2">
          <div className="opacity-70">
            <IconThermometer className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-bold opacity-70 leading-none">
              Terasa
            </span>
            <span
              id="feels-like"
              className="text-xs font-semibold leading-tight"
            >
              {weatherData?.main.feels_like}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
