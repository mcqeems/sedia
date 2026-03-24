import { GoogleGenAI } from "@google/genai";
import getGempa from "@/lib/dashboard/tops/getGempa";
import getWeather from "@/lib/dashboard/tops/getWeather";
import getWeatherPrediction from "@/lib/dashboard/tops/getWeatherPrediction";
import getProfile, { type GetProfile } from "@/lib/supabase/getProfile";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT_TEMPLATE = `
# 🌦️ SYSTEM MESSAGE — SediaBot

Kamu adalah **SediaBot**, asisten AI resmi dari aplikasi **Sedia**.

---

## 🎯 TUJUAN UTAMA
Tugasmu adalah membantu pengguna dalam:
- Memahami kondisi cuaca saat ini dan prakiraannya
- Mengetahui potensi bencana alam
- Menerima peringatan dini
- Mendapatkan rekomendasi tindakan yang aman dan tepat

Fokus utama kamu adalah **keselamatan, kesiapsiagaan, dan kejelasan informasi**.

---

## 📌 FORMAT OUTPUT (WAJIB)
Setiap jawaban yang kamu berikan HARUS:
- Menggunakan **Bahasa Indonesia**
- Ditulis dalam format **Markdown**
- Menggunakan struktur yang rapi seperti:
  - Judul (##)
  - Bullet points (-)
  - Penekanan (bold) jika diperlukan

Jika tidak menggunakan Markdown atau Bahasa Indonesia, maka jawaban dianggap tidak valid.

---

## 🧠 CARA MENJAWAB
Saat merespons pengguna:
- Gunakan bahasa yang **jelas, santai, dan mudah dipahami**
- Tetap **tenang dan tidak menimbulkan kepanikan**
- Berikan jawaban yang **ringkas tapi informatif**
- Utamakan **solusi praktis**

## 💡 EFISIENSI TOKEN
- Prioritaskan jawaban pendek (maksimal 6 bullet atau 3 paragraf singkat)
- Hindari pengulangan yang tidak perlu
- Jika pengguna minta detail lanjutan, baru perluas penjelasan

---

## 🌍 CAKUPAN INFORMASI
Kamu hanya boleh menjawab hal-hal yang berkaitan dengan:

### 1. Cuaca
- Kondisi cuaca saat ini
- Prakiraan cuaca
- Suhu, kelembaban, angin, dll

### 2. Curah Hujan
- Intensitas hujan
- Dampak potensial (misalnya banjir)

### 3. Peringatan Dini Bencana
- Banjir
- Gempa bumi
- Hujan lebat disertai petir
- Cuaca ekstrem lainnya

### 4. Rekomendasi Tindakan
- Persiapan sebelum bencana
- Tindakan saat bencana
- Tindakan setelah bencana

---

## 🚨 PRIORITAS KESELAMATAN
Jika pengguna berada dalam kondisi berbahaya:
- Berikan instruksi yang **jelas, langsung, dan praktis**
- Gunakan format **langkah-langkah (step-by-step)**
- Prioritaskan tindakan yang **bisa segera dilakukan**
- Jika perlu, sarankan untuk **menghubungi pihak berwenang atau layanan darurat**

---

## 💬 GAYA KOMUNIKASI
- Ramah dan membantu
- Tidak menghakimi
- Tidak bertele-tele
- Fokus ke solusi

Contoh:
> "Ada potensi hujan lebat hari ini. Sebaiknya kamu membawa payung dan menghindari daerah rawan banjir ya."

---

## ❌ BATASAN
- Jangan menjawab di luar topik cuaca dan bencana
- Jangan memberikan informasi yang tidak pasti atau spekulatif
- Jangan menakut-nakuti pengguna
- Jangan menggantikan informasi resmi dari otoritas

---

## ✅ PERAN KAMU
Kamu adalah **asisten keselamatan berbasis AI** yang membantu pengguna:
- Lebih siap menghadapi cuaca ekstrem
- Mengurangi risiko bencana
- Mengambil tindakan yang tepat dengan cepat
`.trim();

type StreamRequestBody = {
  conversationId?: string;
  message?: string;
};

const compactText = (value?: string | null) => (value ?? "").trim();

function formatUserProfile(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};
  const firstName = String(metadata.first_name ?? "").trim();
  const lastName = String(metadata.last_name ?? "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const name = fullName || String(metadata.name ?? "").trim() || "Pengguna";

  return {
    name,
    email: user.email ?? null,
  };
}

function formatCurrentWeather(weather: Awaited<ReturnType<typeof getWeather>>) {
  const weatherMain = weather.weather?.[0];

  return {
    condition: weatherMain?.main ?? null,
    description: weatherMain?.description ?? null,
    temperature_c: weather.main?.temp ?? null,
    feels_like_c: weather.main?.feels_like ?? null,
    humidity_percent: weather.main?.humidity ?? null,
    wind_speed_mps: weather.wind?.speed ?? null,
    cloud_cover_percent: weather.clouds?.all ?? null,
    rain_last_1h_mm: weather.rain?.["1h"] ?? 0,
    observed_at_unix: weather.dt ?? null,
  };
}

function formatPrediction(
  prediction: Awaited<ReturnType<typeof getWeatherPrediction>>,
) {
  const root = prediction?.data as {
    lokasi?: {
      adm4?: string;
      desa?: string;
      kecamatan?: string;
      kotkab?: string;
      provinsi?: string;
    };
    data?: Array<{
      cuaca?: Array<
        Array<{
          local_datetime?: string;
          weather_desc?: string;
          t?: number;
          hu?: number;
          ws?: number;
          tp?: number;
        }>
      >;
    }>;
  };

  const firstContainer = root?.data?.[0];
  const timeline = (firstContainer?.cuaca ?? []).flat().slice(0, 8);

  return {
    location: {
      adm4: root?.lokasi?.adm4 ?? null,
      desa: root?.lokasi?.desa ?? null,
      kecamatan: root?.lokasi?.kecamatan ?? null,
      kotkab: root?.lokasi?.kotkab ?? null,
      provinsi: root?.lokasi?.provinsi ?? null,
      fallback_adm4: prediction?.newAdm ?? null,
    },
    next_forecast_points: timeline.map((item) => ({
      local_datetime: item.local_datetime ?? null,
      weather_desc: item.weather_desc ?? null,
      temperature_c: item.t ?? null,
      humidity_percent: item.hu ?? null,
      wind_speed_mps: item.ws ?? null,
      precipitation_mm: item.tp ?? null,
    })),
  };
}

function formatLatestEarthquake(gempa: Awaited<ReturnType<typeof getGempa>>) {
  const latest = gempa?.Infogempa?.gempa;

  return {
    date: latest?.Tanggal ?? null,
    time: latest?.Jam ?? null,
    datetime: latest?.DateTime ?? null,
    magnitude: latest?.Magnitude ?? null,
    depth: latest?.Kedalaman ?? null,
    coordinates: latest?.Coordinates ?? null,
    area: latest?.Wilayah ?? null,
    potential: latest?.Potensi ?? null,
    felt: latest?.Dirasakan ?? null,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: StreamRequestBody;
  try {
    body = (await request.json()) as StreamRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const conversationId = body.conversationId?.trim();
  const userMessage = body.message?.trim();

  if (!conversationId || !userMessage) {
    return new Response("conversationId and message are required", {
      status: 400,
    });
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("conversation")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (conversationError || !conversation) {
    return new Response("Conversation not found", { status: 404 });
  }

  const { error: userInsertError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: userMessage,
  });

  if (userInsertError) {
    console.error("Failed to insert user message:", userInsertError);
    return new Response("Failed to save user message", { status: 500 });
  }

  const { data: history, error: historyError } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(40);

  if (historyError) {
    console.error("Failed to fetch message history:", historyError);
    return new Response("Failed to read message history", { status: 500 });
  }

  const profile = (await getProfile({
    userId: user.id,
    supabase,
  })) as GetProfile;

  const latitude = compactText(profile.langitude);
  const longitude = compactText(profile.longitude);
  const adm4 = compactText(profile.adm_4);
  const displayLocation = compactText(profile.display_location);

  const [weatherResult, predictionResult, gempaResult] =
    await Promise.allSettled([
      latitude && longitude
        ? getWeather({ latitude, longitude })
        : Promise.resolve(null),
      adm4 || displayLocation
        ? getWeatherPrediction({
            adm: adm4 || undefined,
            displayLocation: displayLocation || undefined,
          })
        : Promise.resolve(null),
      getGempa(),
    ]);

  const userIdentity = formatUserProfile(user);
  const userProfileContext = {
    name: userIdentity.name,
    email: userIdentity.email,
    display_location: profile.display_location ?? null,
    provinsi: profile.provinsi ?? null,
    kabupaten: profile.kabupaten ?? null,
    kecamatan: profile.kecamatan ?? null,
    kelurahan: profile.kelurahan ?? null,
    adm_4: profile.adm_4 ?? null,
    langitude: profile.langitude ?? null,
    longitude: profile.longitude ?? null,
  };

  const liveKnowledgeBase = {
    fetched_at: new Date().toISOString(),
    current_weather:
      weatherResult.status === "fulfilled" && weatherResult.value
        ? formatCurrentWeather(weatherResult.value)
        : null,
    weather_prediction:
      predictionResult.status === "fulfilled" && predictionResult.value
        ? formatPrediction(predictionResult.value)
        : null,
    latest_earthquake:
      gempaResult.status === "fulfilled" && gempaResult.value
        ? formatLatestEarthquake(gempaResult.value)
        : null,
  };

  const historyText = (history ?? [])
    .map(
      (item) =>
        `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`,
    )
    .join("\n");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const streamResponse = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: `${SYSTEM_PROMPT_TEMPLATE}\n\n## USER PROFILE TERBARU\n${JSON.stringify(userProfileContext, null, 2)}\n\n## KNOWLEDGE BASE TERBARU\n${JSON.stringify(liveKnowledgeBase, null, 2)}\n\n## INSTRUKSI KONTEKS\n- Gunakan knowledge base terbaru di atas sebagai referensi utama.\n- Jika sebagian data null/tidak tersedia, jelaskan keterbatasannya secara singkat.\n- Prioritaskan rekomendasi yang relevan dengan profil dan lokasi pengguna.\n\n## CHAT HISTORY\n${historyText}\n\nAssistant:`,
  });

  let assistantMessage = "";
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamResponse) {
          const text = chunk.text ?? "";
          if (!text) {
            continue;
          }

          assistantMessage += text;
          controller.enqueue(encoder.encode(text));
        }

        const finalAssistantMessage =
          assistantMessage.trim() ||
          "Maaf, respons belum tersedia. Silakan coba kirim ulang pertanyaan Anda.";

        const { error: botInsertError } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            role: "bot",
            content: finalAssistantMessage,
          });

        if (botInsertError) {
          console.error("Failed to insert bot message:", botInsertError);
          controller.error(new Error("Failed to save assistant response"));
          return;
        }

        controller.close();
      } catch (error) {
        console.error("Chat stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
