"use client";

import {
  IconActivity,
  IconAlertTriangle,
  IconCheck,
  IconRadioactive,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import getAiAnalyisis from "@/lib/dashboard/tops/getAiAnalyisis";
import getAnalysis from "@/lib/supabase/getAnalysis";

export default function AiAnalysis() {
  const { state } = useDashContext();
  // biome-ignore lint/suspicious/noExplicitAny: it's okay
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const data = await getAnalysis();
        if (data?.status) {
          setAnalysis(data);
        }
      } catch (error) {
        console.error("Failed to fetch analysis", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await getAiAnalyisis({
        displayLocation: state.state.displayLocation,
        adm4: state.state.adm4,
        latitude: state.state.latitude,
        longitude: state.state.longitude,
        gempaInfo: state.state.gempaInfo
          ? JSON.stringify(state.state.gempaInfo)
          : "Tidak ada data gempa",
        peringatanCuaca: state.state.peringatanCuaca
          ? JSON.stringify(state.state.peringatanCuaca)
          : "Tidak ada peringatan cuaca",
        cuaca: state.state.cuaca
          ? JSON.stringify(state.state.cuaca)
          : "Tidak ada data cuaca",
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Generate error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const isReady = !!(
    state.state.latitude &&
    state.state.longitude &&
    state.state.cuaca
  );

  if (loading) {
    return (
      <div className="flex w-full min-h-[250px] rounded-lg bg-primary/50 overflow-hidden">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="max-h-[275px] h-full w-full rounded-lg bg-primary p-4 text-white flex flex-col md:h-full justify-between relative overflow-hidden">
      {/* Loading Overlay when generating */}
      {generating && (
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-white rounded-full animate-spin" />
            <span className="text-sm font-medium">Menganalisis Data...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 z-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">Analisis</h3>
        </div>

        {analysis && (
          <div className="flex flex-row items-center gap-3 mt-1">
            {analysis.updated_at && (
              <p className="text-[10px] font-medium opacity-60">
                Diperbarui:{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(analysis.updated_at))}
              </p>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!isReady || generating}
              className="text-xs bg-background/10 hover:bg-background/20 cursor-pointer px-3 py-1.5 rounded-md flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              Perbarui
            </button>
          </div>
        )}
      </div>

      {!analysis ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-0">
          <IconActivity className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-80 mb-6 max-w-sm">
            Dapatkan rekomendasi keselamatan darurat berbasis AI berdasarkan
            kondisi cuaca dan gempa di lokasi Anda.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!isReady || generating}
            className="px-6 py-2.5  disabled:opacity-50 disabled:cursor-not-allowed bg-background/10 hover:bg-background/20 rounded-2xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            Buat Analisis Baru
          </button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-4 z-0">
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="flex items-start text-left gap-4 p-3 bg-background/10 rounded-lg border border-white/5 cursor-pointer hover:bg-background/20 transition-colors w-full"
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                analysis.status === "Aman"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : analysis.status === "Waspada"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : analysis.status === "Siaga"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-red-500/20 text-red-400"
              }`}
            >
              {analysis.status === "Aman" ? (
                <IconCheck className="w-6 h-6" />
              ) : analysis.status === "Waspada" ? (
                <IconAlertTriangle className="w-6 h-6" />
              ) : (
                <IconRadioactive className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-sm font-bold opacity-90 mb-1">
                Status: {analysis.status}
              </p>
              <p className="text-sm font-medium leading-snug">
                {typeof analysis.content === "string"
                  ? JSON.parse(analysis.content).headline
                  : analysis.content?.headline}
              </p>
              <p className="text-[10px] font-medium opacity-60 mt-1 cursor-pointer hover:underline text-blue-300">
                Lihat Detail
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Details Popup */}
      {showDetails && analysis && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
          <div className="bg-primary border border-white/20 w-full max-w-2xl max-h-[80vh] rounded-xl flex flex-col overflow-hidden text-white">
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5 shrink-0">
              <h3 className="font-bold">Detail Analisis</h3>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              <div className="flex items-start gap-3 p-3 bg-background/10 rounded-lg border border-white/5 flex-shrink-0">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    analysis.status === "Aman"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : analysis.status === "Waspada"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : analysis.status === "Siaga"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {analysis.status === "Aman" ? (
                    <IconCheck className="w-5 h-5" />
                  ) : analysis.status === "Waspada" ? (
                    <IconAlertTriangle className="w-5 h-5" />
                  ) : (
                    <IconRadioactive className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold opacity-90 mb-0.5">
                    Status: {analysis.status}
                  </p>
                  <p className="text-xs font-medium leading-snug opacity-80">
                    {typeof analysis.content === "string"
                      ? JSON.parse(analysis.content).headline
                      : analysis.content?.headline}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs opacity-80 leading-relaxed mb-4">
                  {typeof analysis.content === "string"
                    ? JSON.parse(analysis.content).analysis_detail
                    : analysis.content?.analysis_detail}
                </p>

                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                    Langkah Taktis
                  </h3>
                  <ul className="space-y-2">
                    {(typeof analysis.content === "string"
                      ? JSON.parse(analysis.content).action_steps
                      : analysis.content?.action_steps
                    )?.map((step: string, idx: number) => (
                      <li
                        // biome-ignore lint/suspicious/noArrayIndexKey: it's fine for simple lists
                        key={idx}
                        className="text-xs flex gap-2 items-start bg-black/5 p-2 rounded"
                      >
                        <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="opacity-90 leading-tight">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
