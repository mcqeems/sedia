"use client";

import {
  IconActivity,
  IconAlertTriangle,
  IconCheck,
  IconFlame,
  IconListCheck,
  IconRadioactive,
  IconShieldExclamation,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import getAiAnalyisis from "@/lib/dashboard/tops/getAiAnalyisis";
import getAnalysis from "@/lib/supabase/getAnalysis";

type AnalysisContent = {
  headline?: string;
  analysis_detail?: string;
  potential_risks?: string[];
  action_steps?: string[];
  urgency_level?: number;
};

export default function AiAnalysis() {
  const { state } = useDashContext();
  // biome-ignore lint/suspicious/noExplicitAny: it's okay
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const analysisContent = useMemo<AnalysisContent | null>(() => {
    if (!analysis?.content) {
      return null;
    }

    if (typeof analysis.content === "string") {
      try {
        return JSON.parse(analysis.content) as AnalysisContent;
      } catch {
        return null;
      }
    }

    return analysis.content as AnalysisContent;
  }, [analysis]);

  const urgencyLevel = analysisContent?.urgency_level ?? 0;
  const urgencyLabel =
    urgencyLevel >= 7 ? "Tinggi" : urgencyLevel >= 4 ? "Sedang" : "Rendah";
  const updatedAtLabel = useMemo(() => {
    const rawUpdatedAt = analysis?.updated_at;

    if (!rawUpdatedAt) {
      return "Baru saja";
    }

    const updatedAtDate = new Date(rawUpdatedAt);
    if (Number.isNaN(updatedAtDate.getTime())) {
      return "Baru saja";
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(updatedAtDate);
  }, [analysis?.updated_at]);

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
    <div className="max-h-[275px] w-full shrink-0 rounded-lg bg-primary p-4 text-white flex flex-col justify-between relative overflow-hidden">
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
            <p className="text-xs font-medium opacity-80">
              Diperbarui: {updatedAtLabel}
            </p>
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
            <div>
              <div className="flex flex-row items-center gap-1">
                <p className="text-sm font-bold opacity-90 mb-1">Status:</p>
                <div
                  className={`flex justify-center items-center gap-1 px-2 ${analysis.status === "Aman" ? "bg-background/10 " : analysis.status === "Waspada" ? "bg-yellow-200" : "bg-red-200"} bg-background/10 rounded-2xl`}
                >
                  {analysis.status === "Aman" ? (
                    <IconCheck className="w-4 h-4" />
                  ) : analysis.status === "Waspada" ? (
                    <IconAlertTriangle className="w-4 h-4" />
                  ) : (
                    <IconRadioactive className="w-4 h-4" />
                  )}
                  <p className="text-sm font-bold opacity-90">
                    {analysis.status}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium leading-snug">
                {analysisContent?.headline}
              </p>
              <p className="text-[10px] font-medium opacity-90 mt-1 cursor-pointer hover:underline ">
                Lihat Detail
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Details Popup */}
      {showDetails && analysis && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4 overflow-hidden">
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
              <div className="flex flex-col items-start gap-1 p-3 bg-background/10 rounded-lg flex-shrink-0">
                <div className="flex flex-row items-center gap-1">
                  <p className="text-sm font-bold opacity-90 mb-1">Status:</p>
                  <div
                    className={`flex justify-center items-center gap-1 px-2 ${analysis.status === "Aman" ? "bg-background/10 " : analysis.status === "Waspada" ? "bg-yellow-200" : "bg-red-200"} bg-background/10 rounded-2xl`}
                  >
                    {analysis.status === "Aman" ? (
                      <IconCheck className="w-4 h-4" />
                    ) : analysis.status === "Waspada" ? (
                      <IconAlertTriangle className="w-4 h-4" />
                    ) : (
                      <IconRadioactive className="w-4 h-4" />
                    )}
                    <p className="text-sm font-bold opacity-90">
                      {analysis.status}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium leading-snug opacity-80">
                    {analysisContent?.headline}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm opacity-80 leading-relaxed mb-4">
                  {analysisContent?.analysis_detail}
                </p>

                <div className="space-y-2 mb-4">
                  <h3 className="text-sm uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <IconFlame className="w-3.5 h-3.5" /> Tingkat Urgensi
                  </h3>
                  <div className="rounded-lg bg-background/10 order p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold">{urgencyLabel}</p>
                      <p className="text-[11px] opacity-70">{`${urgencyLevel}/10`}</p>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full transition-all"
                        style={{
                          width: `${Math.min(Math.max(urgencyLevel, 0), 10) * 10}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h3 className="text-sm uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <IconShieldExclamation className="w-3.5 h-3.5" /> Potensi
                    Risiko
                  </h3>
                  <ul className="space-y-2">
                    {analysisContent?.potential_risks?.map(
                      (risk: string, idx: number) => (
                        <li
                          // biome-ignore lint/suspicious/noArrayIndexKey: it's fine for simple lists
                          key={idx}
                          className="text-xs flex gap-2 items-start bg-background/10 p-2 rounded"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 mt-1.5 flex-shrink-0" />
                          <span className="opacity-90 leading-tight">
                            {risk}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <IconListCheck className="w-3.5 h-3.5" /> Langkah Taktis
                  </h3>
                  <ul className="space-y-2">
                    {analysisContent?.action_steps?.map(
                      (step: string, idx: number) => (
                        <li
                          // biome-ignore lint/suspicious/noArrayIndexKey: it's fine for simple lists
                          key={idx}
                          className="text-xs flex gap-2 items-start bg-background/10 p-2 rounded"
                        >
                          <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="opacity-90 leading-tight">
                            {step}
                          </span>
                        </li>
                      ),
                    )}
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
