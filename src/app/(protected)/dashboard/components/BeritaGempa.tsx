"use client";

import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import getBeritaGempa, {
  type EarthquakeResponse,
} from "@/lib/dashboard/bottoms/getBeritaGempa";

export default function BeritaGempa() {
  const [isLoading, setIsLoading] = useState(true);
  const [beritaGempa, setBeritaGempa] = useState<EarthquakeResponse>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchBeritaGempa = async () => {
      const data = await getBeritaGempa();
      setBeritaGempa(data);
      setIsLoading(false);
    };
    fetchBeritaGempa();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[180px] w-full rounded-lg bg-primary/50 md:max-w-[50%]">
        <Skeleton />
      </div>
    );
  }

  const recentGempa = beritaGempa?.Infogempa?.gempa?.[0];
  const allGempa = beritaGempa?.Infogempa?.gempa;

  return (
    <div className="h-[180px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:max-w-[50%]">
      <h3>Berita Gempa Terkini</h3>
      <div className="md:mt-2 mt-3 flex flex-col items-center gap-2">
        {recentGempa && (
          <div className="w-full h-full flex flex-row items-center px-3 py-3 bg-background/10 hover:bg-background/20 transition-colors rounded-lg gap-4">
            <div className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-md border  shrink-0">
              <span className="text-xl font-bold leading-none">
                {recentGempa.Magnitude}
              </span>
              <span className="text-[9px] font-medium opacity-80 mt-0.5">
                Mag
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p
                className="font-bold text-sm truncate"
                title={recentGempa.Wilayah}
              >
                {recentGempa.Wilayah}
              </p>
              <p className="text-xs opacity-80 mt-1">
                {new Intl.DateTimeFormat("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                }).format(new Date(recentGempa.DateTime))}
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full max-w-[150px] p-2 bg-background/10 rounded-2xl hover:bg-background/20 transition-colors cursor-pointer flex flex-row gap-1 items-center justify-center"
        >
          <IconPlus className="w-3.5 h-3.5" />
          <p className="text-center text-sm">Lihat lebih banyak</p>
        </button>
      </div>

      {/* Popup / Modal */}
      {isModalOpen && allGempa && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
          <div className="bg-primary border border-white/20 w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden text-primary-foreground">
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5 shrink-0">
              <h4 className="font-bold text-sm">15 Gempa Dirasakan Terbaru</h4>
              <button
                type="button"
                className="text-background hover:text-background/50 font-bold px-2 rounded-full transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col overflow-y-auto gap-3 p-4 custom-scrollbar">
              {allGempa.map((gempa, idx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: idk
                  key={idx}
                  className="flex flex-col bg-background/10 hover:bg-background/20 transition-colors rounded-lg overflow-y-auto border border-white/5 shrink-0"
                >
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click handled structurally */}
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: Click handled structurally */}
                  <div
                    className="w-full flex flex-row items-center justify-between px-3 py-3 cursor-pointer gap-4"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === idx ? null : idx)
                    }
                  >
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <div className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-md border shrink-0">
                        <span className="text-xl font-bold leading-none">
                          {gempa.Magnitude}
                        </span>
                        <span className="text-[9px] font-medium opacity-80 mt-0.5">
                          Mag
                        </span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-bold text-sm line-clamp-2">
                          {gempa.Wilayah}
                        </p>
                        <p className="text-xs mt-1 opacity-80">
                          {gempa.Tanggal} • {gempa.Jam}
                        </p>
                      </div>
                    </div>

                    <IconChevronDown
                      className={`w-5 h-5 shrink-0 opacity-70 transition-transform duration-300 ease-in-out ${
                        expandedIndex === idx ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      expandedIndex === idx
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3 text-sm border-t border-white/10 bg-black/10 flex flex-col gap-3">
                        <div className="flex flex-col gap-2 text-xs opacity-90 border-b border-white/10 pb-3">
                          <span className="flex items-center gap-1">
                            📏 Kedalaman: <b>{gempa.Kedalaman}</b>
                          </span>
                          <span className="flex items-center gap-1">
                            📍 Koordinat: <b>{gempa.Coordinates}</b> (Lintang:{" "}
                            {gempa.Lintang}, Bujur: {gempa.Bujur})
                          </span>
                          <span className="flex items-center gap-1">
                            📅 Waktu:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZoneName: "short",
                              }).format(new Date(gempa.DateTime))}
                            </b>
                          </span>
                        </div>
                        <div className="opacity-95 leading-relaxed text-left text-primary-foreground/90">
                          <span className="font-bold text-xs opacity-80 block mb-1">
                            Dirasakan (Skala MMI):
                          </span>
                          <p>{gempa.Dirasakan}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
