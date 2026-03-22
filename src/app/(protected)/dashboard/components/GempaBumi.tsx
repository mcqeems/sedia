"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import getGempa from "@/lib/dashboard/tops/getGempa";

export default function GempaBumi() {
  const { dispatch, state } = useDashContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGempa = async () => {
      try {
        const data = await getGempa();
        dispatch({ type: "SET_STATE", payload: { gempaInfo: data } });
        setIsLoading(false);
      } catch (error) {
        console.error("Error when fetching gempa data: ", error);
      }
    };

    fetchGempa();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-[125px] w-full rounded-lg bg-primary/50 overflow-hidden shadow-xl">
        <Skeleton />
      </div>
    );
  }

  const gempa = state.state.gempaInfo?.Infogempa?.gempa;

  return (
    <div className="h-[125px] w-full rounded-lg bg-primary p-4 text-primary-foreground shadow-xl flex flex-col justify-between overflow-hidden">
      {!gempa ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm opacity-80">Data tidak tersedia</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="font-bold flex items-center gap-1.5">
              <span>🔴</span> Gempa Terkini
            </h3>
            <span className="text-[10px] opacity-80 font-medium bg-white/10 px-2 py-0.5 rounded-full">
              {gempa.Tanggal} • {gempa.Jam}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-md p-2 hover:bg-white/20 transition-colors flex-1 w-full relative">
            <div className="flex flex-col items-center justify-center px-4 py-1.5 bg-red-500/20 text-red-50 rounded-md border border-red-400/30">
              <span className="text-xl font-bold leading-none">
                {gempa.Magnitude}
              </span>
              <span className="text-[10px] font-medium opacity-80 mt-0.5">
                Mag
              </span>
            </div>

            <div className="flex flex-col flex-1 min-w-0 justify-center gap-1">
              <span
                className="text-xs font-semibold truncate flex items-center gap-1.5"
                title={gempa.Wilayah}
              >
                📍 <span className="truncate">{gempa.Wilayah}</span>
              </span>
              <div className="flex items-center gap-3 text-[10px] opacity-85">
                <span
                  className="flex items-center gap-1 pr-2 border-r border-white/20"
                  title="Kedalaman"
                >
                  📏 {gempa.Kedalaman}
                </span>
                <span
                  className="flex items-center gap-1 truncate"
                  title="Potensi"
                >
                  🌊 <span className="truncate">{gempa.Potensi}</span>
                </span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end justify-center px-2 text-[10px] opacity-75 right-2 absolute">
              <div className="flex items-center gap-1">
                <span>🌐</span> {gempa.Lintang}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span>🧭</span> {gempa.Bujur}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
