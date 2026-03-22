import updateProfile from "@/lib/supabase/updateProfile";
import getAdmCode from "../location/getAdmCode";

export interface WeatherResponse {
  lokasi: LocationInfo;
  data: WeatherDataContainer[];
}

export interface LocationInfo {
  adm1: string;
  adm2: string;
  adm3: string;
  adm4: string;
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lon: number;
  lat: number;
  timezone: string;
  type?: string; // Optional because it only appears in the nested 'data' location
}

export interface WeatherDataContainer {
  lokasi: LocationInfo;
  /**
   * Represented as a 2D array: WeatherTimeline[][]
   * Each inner array seems to group weather forecasts by date/period.
   */
  cuaca: WeatherTimeline[][];
}

export interface WeatherTimeline {
  datetime: string; // ISO 8601 format
  t: number; // Temperature
  tcc: number; // Total Cloud Cover
  tp: number; // Total Precipitation
  weather: number; // Weather code
  weather_desc: string; // Description in Indonesian
  weather_desc_en: string; // Description in English
  wd_deg: number; // Wind direction in degrees
  wd: string; // Wind direction (cardinal)
  wd_to: string; // Wind direction "to"
  ws: number; // Wind speed
  hu: number; // Humidity
  vs: number; // Visibility
  vs_text: string; // Visibility description
  time_index: string; // e.g., "8-9"
  analysis_date: string;
  image: string; // URL to SVG icon
  utc_datetime: string;
  local_datetime: string;
}

export interface Response {
  data: WeatherResponse;
  newAdm: string | null | undefined;
}

export default async function getWeatherPrediction({
  adm,
  displayLocation,
}: {
  adm: string | undefined;
  displayLocation: string | undefined;
}) {
  const response = await fetch(
    `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm}`,
  );

  if (!response.ok) {
    setTimeout(async () => {
      const newResponse = await fetch(
        `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm}`,
      );

      if (!newResponse.ok) {
        const getNewAdm = await getAdmCode(displayLocation);

        const newResponse2 = await fetch(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${getNewAdm}`,
        );

        if (!newResponse2.ok) {
          throw new Error("Gagal mengambil data prediksi cuaca");
        }

        updateProfile({ adm4: getNewAdm });

        const newData = await newResponse2.json();

        return { data: newData, newAdm: getNewAdm };
      }
    }, 2500);

    const data = await response.json();

    const finalData: Response = { data: data, newAdm: null };

    return finalData;
  }

  const data = await response.json();

  const finalData: Response = { data: data, newAdm: null };

  return finalData;
}
