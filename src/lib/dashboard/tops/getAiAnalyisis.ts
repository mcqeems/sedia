"use server";

import { getLlm, LLM_MODEL } from "@/lib/ai";
import type { WeatherAlert } from "@/lib/dashboard/bottoms/getPeringatanCuaca";
import type { EarthquakeData } from "@/lib/dashboard/tops/getGempa";
import type { WeatherResponse } from "@/lib/dashboard/tops/getWeather";
import { fromDashboardData, type RiskScore } from "@/lib/spk/risk";
import insertAnalysis from "@/lib/supabase/insertAnalysis";
import updateAnalysis from "@/lib/supabase/updateAnalysis";

interface Prerequisites {
  displayLocation?: string;
  adm4?: string;
  latitude?: string;
  longitude?: string;
  gempaInfo?: EarthquakeData | null;
  peringatanCuaca?: WeatherAlert | WeatherAlert[] | null;
  cuaca?: WeatherResponse | null;
}

interface Content {
  headline: string;
  analysis_detail: string;
  potential_risks: string[] | string;
  action_steps: string[] | string;
  urgency_level: number;
}

interface Response {
  status: string;
  content: Content;
}

const getAiInstance = () => {
  return getLlm();
};

export default async function getAiAnalyisis({
  displayLocation,
  adm4,
  latitude,
  longitude,
  gempaInfo,
  peringatanCuaca,
  cuaca,
}: Prerequisites) {
  const riskScore = fromDashboardData({ cuaca, gempaInfo, peringatanCuaca });

  const riskContext = buildRiskContext(riskScore);

  const ai = getAiInstance();
  const response = await ai.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "user",
        content: `
### ROLE
Anda adalah Sistem Pakar Analisis Bencana (Disaster Analysis Engine). Tugas Anda adalah mensintesis data cuaca dan seismik real-time menjadi penilaian risiko yang akurat untuk pengguna.

### INPUT DATA CONTEXT
Anda akan menerima data dalam format berikut:
1. Lokasi Client:
Location: ${displayLocation}
adm_4: ${adm4}
latitude: ${latitude}
longitude: ${longitude}

2. Skor Risiko Simulasi (SPK/SAW — harus dijadikan acuan objektif):
${riskContext}

3. Cuaca Saat Ini (Dari Lokasi Client):
${cuaca ? JSON.stringify(cuaca, null, 2) : "Tidak ada data cuaca"}

4. Gempa Bumi Terkini (Nasional/Umum):
${gempaInfo ? JSON.stringify(gempaInfo, null, 2) : "Tidak ada data gempa"}

5. Peringatan Dini Cuaca (Nasional/Umum):
${peringatanCuaca ? JSON.stringify(peringatanCuaca, null, 2) : "Tidak ada peringatan cuaca"}

### OUTPUT RULES
1. Output HARUS selalu dalam format JSON.
2. Gunakan Bahasa Indonesia yang formal namun mudah dipahami.
3. Status HARUS sama persis dengan "level" pada Skor Risiko Simulasi di atas.
4. Status harus dipilih dari salah satu kategori berikut berdasarkan tingkat risiko:
   - "Aman": Tidak ada ancaman terdeteksi.
   - "Waspada": Ada potensi gangguan kecil (misal: hujan sedang berkepanjangan).
   - "Siaga": Potensi bencana tinggi dalam 24-72 jam (misal: cuaca ekstrem, gempa besar di dekat lokasi).
   - "Awas": Ancaman langsung atau bencana sedang terjadi.

### LOGIKA PENILAIAN (HEURISTICS)
- Mulailah penilaian dari Skor Risiko Simulasi, lalu jelaskan faktor-faktor yang menyebabkannya.
- Jika data bertabrakan (misal: cuaca cerah tapi ada peringatan dini badai), prioritaskan Peringatan Dini (Early Warning).

### JSON STRUCTURE
{
  "status": "Aman | Waspada | Siaga | Awas",
  "content": {
    "headline": "Ringkasan situasi dalam 1 kalimat",
    "analysis_detail": "Penjelasan mendalam mengapa status tersebut dipilih",
    "potential_risks": ["Daftar risiko spesifik, misal: Banjir, Longsor, Pohon Tumbang"],
    "action_steps": ["Daftar langkah taktis yang harus dilakukan pengguna"],
    "urgency_level": 1-10 (1 untuk sangat rendah, 10 untuk evakuasi segera)
  }
}
		`,
      },
    ],
  });

  const textResponse = response.choices[0]?.message.content || "";
  const cleanedText = textResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let data: Response;
  try {
    data = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Invalid AI response format");
  }

  const updated = await updateAnalysis({
    status: data.status,
    content: data.content,
    riskScore: riskScore.score,
  });

  if (!updated) {
    await insertAnalysis({
      status: data.status,
      content: data.content,
      riskScore: riskScore.score,
    });
  }

  return { ...data, riskScore };
}

function buildRiskContext(riskScore: RiskScore): string {
  const contributors = riskScore.breakdown
    .map(
      (b) =>
        `${b.criterion}: nilai ${b.raw}, kontribusi ${Math.round(b.contribution * 100)}% dari skor`,
    )
    .join("\n");

  return `Skor Risiko: ${riskScore.score}/100
Level: ${riskScore.level}
Rincian kontributor:
${contributors}`;
}
