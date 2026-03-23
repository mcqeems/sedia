"use server";

import { GoogleGenAI } from "@google/genai";
import getAnalysis from "@/lib/supabase/getAnalysis";
import insertAnalysis from "@/lib/supabase/insertAnalysis";
import updateAnalysis from "@/lib/supabase/updateAnalysis";

interface Prerequisites {
  displayLocation?: string;
  adm4?: string;
  latitude?: string;
  longitude?: string;
  gempaInfo?: string;
  peringatanCuaca?: string;
  cuaca?: string;
}

interface Content {
  headline: string;
  analysis_detail: string;
  potential_riks: string[] | string;
  action_steps: string[] | string;
  urgency_level: number;
}

interface Response {
  status: string;
  content: Content;
}

const getAiInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
### ROLE
Anda adalah Sistem Pakar Analisis Bencana (Disaster Analysis Engine). Tugas Anda adalah mensintesis data cuaca dan seismik real-time menjadi penilaian risiko yang akurat untuk pengguna.

### INPUT DATA CONTEXT
Anda akan menerima data dalam format berikut:
1. Lokasi Client:
Location: ${displayLocation}
adm_4: ${adm4}
latitude: ${latitude}
longitude: ${longitude}

2. Cuaca Saat Ini (Dari Lokasi Client):
${cuaca}

3. Gempa Bumi Terkini (Nasional/Umum):
${gempaInfo}

4. Peringatan Dini Cuaca (Nasional/Umum):
${peringatanCuaca}

### OUTPUT RULES
1. Output HARUS selalu dalam format JSON.
2. Gunakan Bahasa Indonesia yang formal namun mudah dipahami.
3. Status harus dipilih dari salah satu kategori berikut berdasarkan tingkat risiko:
   - "Aman": Tidak ada ancaman terdeteksi.
   - "Waspada": Ada potensi gangguan kecil (misal: hujan sedang berkepanjangan).
   - "Siaga": Potensi bencana tinggi dalam 24-72 jam (misal: cuaca ekstrem, gempa besar di dekat lokasi).
   - "Awas": Ancaman langsung atau bencana sedang terjadi.

### LOGIKA PENILAIAN (HEURISTICS)
- Skalakan status ke "Siaga" jika prakiraan 3 hari menunjukkan hujan lebat/badai secara berturut-turut.
- Skalakan status ke "Awas" jika ada Gempa > 5.0 SR dalam radius < 150km dari lokasi client atau jika ada Peringatan Dini Cuaca level Merah di lokasi client.
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
  });

  const textResponse = response.text || "";
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

  const analysisData = await getAnalysis();

  if (analysisData?.status) {
    await updateAnalysis({
      status: data.status,
      content: data.content,
    });

    return data;
  } else {
    await insertAnalysis({
      status: data.status,
      content: data.content,
    });

    return data;
  }
}
