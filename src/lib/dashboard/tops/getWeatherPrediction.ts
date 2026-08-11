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
  type?: string;
}

export interface WeatherDataContainer {
  lokasi: LocationInfo;
  cuaca: WeatherTimeline[][];
}

export interface WeatherTimeline {
  datetime: string;
  t: number;
  tcc: number;
  tp: number;
  weather: number;
  weather_desc: string;
  weather_desc_en: string;
  wd_deg: number;
  wd: string;
  wd_to: string;
  ws: number;
  hu: number;
  vs: number;
  vs_text: string;
  time_index: string;
  analysis_date: string;
  image: string;
  utc_datetime: string;
  local_datetime: string;
}

export interface Response {
  data: WeatherResponse;
  newAdm: string | null | undefined;
}

const BMKG_URL = "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=";

async function fetchBmkg(
  adm4: string,
): Promise<{ ok: boolean; data?: WeatherResponse }> {
  try {
    const res = await fetch(`${BMKG_URL}${adm4}`);
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as WeatherResponse;
    if (!data?.data?.[0]?.cuaca) return { ok: false };
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

/**
 * Scan kecamatan within the same kabupaten (xx.xx) to find a valid adm4 code.
 * Tries kecamatan 01–40, for each trying leaf 1001 then 2001.
 * Skips codes in the skip set.
 * Returns the first valid code + data, or null if none found.
 */
async function scanKabupaten(
  kabPrefix: string,
  skip: Set<string>,
): Promise<{ adm4: string; data: WeatherResponse } | null> {
  for (let kec = 1; kec <= 40; kec++) {
    const kecStr = kec.toString().padStart(2, "0");
    for (const leaf of ["1001", "2001"]) {
      const candidate = `${kabPrefix}.${kecStr}.${leaf}`;
      if (skip.has(candidate)) continue;
      skip.add(candidate);

      const result = await fetchBmkg(candidate);
      if (result.ok && result.data) {
        return { adm4: candidate, data: result.data };
      }
    }
  }
  return null;
}

export default async function getWeatherPrediction({
  adm,
  displayLocation,
}: {
  adm: string | undefined;
  displayLocation: string | undefined;
}): Promise<Response> {
  const skip = new Set<string>();

  // 1. Happy path — try provided adm directly if valid format
  if (adm && /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(adm)) {
    skip.add(adm);
    const first = await fetchBmkg(adm);
    if (first.ok && first.data) {
      return { data: first.data, newAdm: null };
    }
  }

  // 2. Extract kabupaten prefix (xx.xx) for scanning
  const kabMatch = adm?.match(/^(\d{2}\.\d{2})/);
  if (kabMatch) {
    const found = await scanKabupaten(kabMatch[1], skip);
    if (found) {
      await updateProfile({ adm4: found.adm4 });
      return { data: found.data, newAdm: found.adm4 };
    }
  }

  // 3. Fallback to LLM if adm was missing, malformed, or scan failed
  if (displayLocation) {
    const llmAdm = await getAdmCode(displayLocation, adm);
    if (llmAdm && !skip.has(llmAdm)) {
      skip.add(llmAdm);
      if (/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(llmAdm)) {
        const llmFirst = await fetchBmkg(llmAdm);
        if (llmFirst.ok && llmFirst.data) {
          await updateProfile({ adm4: llmAdm });
          return { data: llmFirst.data, newAdm: llmAdm };
        }
      }

      const llmKabMatch = llmAdm.match(/^(\d{2}\.\d{2})/);
      if (llmKabMatch) {
        const llmFound = await scanKabupaten(llmKabMatch[1], skip);
        if (llmFound) {
          await updateProfile({ adm4: llmFound.adm4 });
          return { data: llmFound.data, newAdm: llmFound.adm4 };
        }
      }
    }
  }

  throw new Error(
    "Gagal menemukan kode wilayah yang valid untuk prakiraan cuaca",
  );
}
