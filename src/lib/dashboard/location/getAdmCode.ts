"use server";

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function getAdmCode(
  location: string | undefined,
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `berikan angka kode saja tanpa penjelasan apapun. contoh output: xx.xx.xx.xxxx. Instruksi: berikan saya kode adm 4 yang cocok dengan alamat ini ${location} sesuai dengan Keputusan Menteri Dalam Negeri Nomor 100.1.1-6117 Tahun 2022 yang bisa digunakan untuk api bmkg.`,
  });

  const rawText = response.text?.trim();
  if (!rawText) return "";

  const admCodeMatch = rawText.match(/\b\d{2}\.\d{2}\.\d{2}\.\d{4}\b/);
  return admCodeMatch?.[0] ?? rawText;
}
