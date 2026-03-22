export interface EarthquakeData {
  Infogempa: Infogempa;
}

export interface Infogempa {
  gempa: Gempa;
}

export interface Gempa {
  Tanggal: string;
  Jam: string;
  DateTime: string; // ISO 8601 format
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string; // Biasanya string dari API, bisa di-cast ke number jika perlu
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan: string;
  Shakemap: string; // Nama file gambar
}

export default async function getGempa() {
  const response = await fetch(
    "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
  );

  const data: EarthquakeData = await response.json();

  return data;
}
