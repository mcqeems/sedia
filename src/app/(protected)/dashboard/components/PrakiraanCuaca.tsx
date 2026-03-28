"use client";

import { IconDroplet, IconMoodSad } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import type {
  WeatherResponse,
  WeatherTimeline,
} from "@/lib/dashboard/tops/getWeatherPrediction";
import getWeatherPrediction from "@/lib/dashboard/tops/getWeatherPrediction";
import getProfile from "@/lib/supabase/getProfile";

export default function PrakiraanCuaca() {
  const { dispatch, state } = useDashContext();
  const refreshVersion = state.status.refreshVersion;
  const [predictionData, setPredictionData] = useState<WeatherResponse>();
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<WeatherTimeline[] | null>(
    null,
  );

  useEffect(() => {
    void refreshVersion;

    const fetchPrediction = async () => {
      if (state.state.displayLocation) {
        try {
          setLoading(true);
          const userData = await getProfile();
          const response = await getWeatherPrediction({
            adm: state.state.adm4 || userData.adm_4,
            displayLocation:
              state.state.displayLocation || userData.display_location,
          });

          // If the utility fetched a new ADM4 string, save it back to our context
          if (response.newAdm) {
            dispatch({ type: "SET_STATE", payload: { adm4: response.newAdm } });
          }

          setPredictionData(response.data);
        } catch (error) {
          console.error("Error fetching predictions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPrediction();
  }, [state.state.displayLocation, state.state.adm4, refreshVersion, dispatch]);

  if (loading) {
    return (
      <div className="flex h-[300px] w-full rounded-lg bg-primary/50 overflow-hidden shadow-xl">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-lg bg-primary p-4 text-primary-foreground overflow-hidden flex flex-col relative">
      <h3 className="font-bold mb-2">Prakiraan Cuaca 3 Hari Kedepan</h3>

      {!predictionData?.data?.[0]?.cuaca ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <IconMoodSad className="w-12 h-12 opacity-80" />
          <p className="text-sm opacity-80 w-full max-w-xs text-center">
            Mohon maaf atas ketidaknyamanan ini, Harap tunggu beberapa saat
            lagi.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-around gap-2 overflow-y-auto custom-scrollbar relative">
          {predictionData.data[0].cuaca.slice(0, 3).map((dayForecasts, idx) => {
            // Pick a forecast for the day (e.g., the middle of the array, or around noon)
            const forecast =
              dayForecasts[Math.floor(dayForecasts.length / 2)] ||
              dayForecasts[0];

            if (!forecast) return null;

            // Format timestamp into day format like "Senin", "Selasa"
            const dateObj = new Date(forecast.local_datetime);
            const dayName =
              idx === 0
                ? "Hari Ini"
                : new Intl.DateTimeFormat("id-ID", {
                    weekday: "long",
                  }).format(dateObj);
            const dateText = new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "short",
            }).format(dateObj);

            return (
              // biome-ignore lint/a11y/noStaticElementInteractions: I don't care
              // biome-ignore lint/a11y/useKeyWithClickEvents: i don't care
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: i don't care
                key={idx}
                onClick={() => setSelectedDay(dayForecasts)}
                className="flex items-center justify-between p-3 rounded-md bg-background/10 hover:bg-background/20 transition-colors cursor-pointer"
              >
                <div className="flex flex-col gap-0.5 w-1/3">
                  <span className="font-medium text-sm leading-tight">
                    {dayName}
                  </span>
                  <span className="text-xs opacity-75">{dateText}</span>
                </div>

                <div className="flex items-center gap-2 w-1/3 justify-center">
                  <div className="w-8 h-8 drop-shadow-sm">
                    <Image
                      src={forecast.image}
                      alt={forecast.weather_desc}
                      fill
                    />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {forecast.weather_desc}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-1/3 justify-end">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">{forecast.t}°C</span>
                    <span className="text-xs opacity-80 flex flex-row items-center justify-center">
                      <IconDroplet className="h-3.5 w-3.5" /> {forecast.hu}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex px-2">
            <div className="text-background text-sm flex flex-row gap-2 items-center justify-center">
              <p>Sumber:</p>
              <a
                className="font-bold text-background hover:underline"
                href="https://www.bmkg.go.id/"
              >
                BMKG
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Popup / Modal for Hourly Forecast */}
      {selectedDay && selectedDay.length > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
          <div className="bg-primary border border-white/20 w-full max-w-2xl max-h-[300px] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5">
              <h4 className="font-bold text-sm">
                {new Intl.DateTimeFormat("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date(selectedDay[0].local_datetime))}
              </h4>
              <button
                type="button"
                className="text-background hover:text-background/50 font-bold px-2 rounded-full transition-colors"
                onClick={() => setSelectedDay(null)}
              >
                ✕
              </button>
            </div>

            <div className="flex overflow-x-auto gap-3 p-4 custom-scrollbar">
              {selectedDay.map((hourForecast, i) => {
                const time = new Intl.DateTimeFormat("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(hourForecast.local_datetime));

                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: i don't care
                    key={i}
                    className="flex flex-col items-center gap-2 min-w-[60px]"
                  >
                    <span className="text-xs opacity-80 font-medium">
                      {time}
                    </span>
                    <div className="w-8 h-8 drop-shadow-sm">
                      <Image
                        src={hourForecast.image}
                        alt={hourForecast.weather_desc}
                        title={hourForecast.weather_desc}
                        fill
                      />
                    </div>

                    <span className="text-sm font-bold">
                      {hourForecast.t}°C
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
