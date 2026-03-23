export interface GempaData {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Dirasakan: string;
}

export interface InfoGempa {
  gempa: GempaData[];
}

export interface EarthquakeResponse {
  Infogempa: InfoGempa;
}

export default async function getBeritaGempa() {
  const response = await fetch(
    "/api/data-bmkg/DataMKG/TEWS/gempadirasakan.json",
  );
  const data: EarthquakeResponse = await response.json();

  return data;
}
