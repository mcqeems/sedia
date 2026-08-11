"use server";

import { getLlm, LLM_MODEL } from "@/lib/ai";

export default async function getAdmCode(
  location: string | undefined,
  failedCode?: string,
): Promise<string> {
  const failedContext = failedCode
    ? `\nPENTING: kode ${failedCode} sudah dicoba dan SALAH (ditolak API BMKG). Berikan kode yang BERBEDA, tetapi masih di kota/kabupaten yang sama.`
    : "";

  const response = await getLlm().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "user",
        content: `berikan angka kode saja tanpa penjelasan apapun. contoh output: xx.xx.xx.xxxx. Instruksi: berikan saya kode adm 4 yang cocok dengan alamat ini ${location} sesuai dengan Keputusan Menteri Dalam Negeri Nomor 100.1.1-6117 Tahun 2022 yang bisa digunakan untuk api bmkg.${failedContext}`,
      },
    ],
  });

  const rawText = response.choices[0]?.message.content?.trim();
  if (!rawText) return "";

  const admCodeMatch = rawText.match(/\b\d{2}\.\d{2}\.\d{2}\.\d{4}\b/);
  const result = admCodeMatch?.[0] ?? rawText;

  // Guard: if LLM returned the same failed code, give up
  if (failedCode && result === failedCode) return "";

  return result;
}
