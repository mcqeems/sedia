"use server";

import { getLlm, LLM_MODEL } from "@/lib/ai";

export default async function getAdmCode(
  location: string | undefined,
): Promise<string> {
  const response = await getLlm().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "user",
        content: `berikan angka kode saja tanpa penjelasan apapun. contoh output: xx.xx.xx.xxxx. Instruksi: berikan saya kode adm 4 yang cocok dengan alamat ini ${location} sesuai dengan Keputusan Menteri Dalam Negeri Nomor 100.1.1-6117 Tahun 2022 yang bisa digunakan untuk api bmkg.`,
      },
    ],
  });

  const rawText = response.choices[0]?.message.content?.trim();
  if (!rawText) return "";

  const admCodeMatch = rawText.match(/\b\d{2}\.\d{2}\.\d{2}\.\d{4}\b/);
  return admCodeMatch?.[0] ?? rawText;
}
