"use client";

import { IconChevronDown, IconPlus, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import getPeringatanCuaca, {
  type WeatherAlert,
} from "@/lib/dashboard/bottoms/getPeringatanCuaca";

export default function BeritaPeringatanCuaca() {
  const { dispatch, state } = useDashContext();
  const refreshVersion = state.status.refreshVersion;
  const [isLoading, setIsLoading] = useState(true);
  const [peringatanCuaca, setPeringatanCuaca] = useState<WeatherAlert[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedAlertIndex, setExpandedAlertIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    void refreshVersion;

    const fetchPeringatan = async () => {
      try {
        setIsLoading(true);
        const response = await getPeringatanCuaca();
        setPeringatanCuaca(response);
        dispatch({
          type: "SET_STATE",
          payload: { peringatanCuaca: response[0] },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeringatan();
  }, [dispatch, refreshVersion]);

  if (isLoading) {
    return (
      <div className="h-[180px] w-full rounded-lg bg-primary/50 md:max-w-[50%]">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="h-[180px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:max-w-[50%]">
      <h3>Peringatan Dini Cuaca</h3>
      <div className="md:mt-2 mt-3 flex flex-col items-center md:gap-2 gap-1">
        {peringatanCuaca && (
          <div className="w-full h-full flex flex-row gap-[20px] items-center px-2 py-3 bg-background/10 hover:bg-background/20 transition-colors rounded-lg">
            <div>
              <Image
                src={`https://openweathermap.org/img/wn/11d@2x.png`}
                alt="weather icon"
                height={50}
                width={50}
                className="drop-shadow-md"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-bold text-sm">{peringatanCuaca[0].title}</p>
              <p className="text-xs opacity-80">
                {new Intl.DateTimeFormat("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                }).format(new Date(peringatanCuaca[0].pubDate))}
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

      {/* Popup / Modal for Semua Peringatan */}
      {isModalOpen && peringatanCuaca && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4 overflow-hidden">
          <div className="bg-primary border border-white/20 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden text-primary-foreground max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5">
              <h4 className="font-bold text-sm">Semua Peringatan Dini Cuaca</h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col overflow-y-auto gap-3 p-4 ">
              {peringatanCuaca.map((peringatan, idx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: Fixed static array handling
                  key={idx}
                  className="flex flex-col bg-background/10 hover:bg-background/20 transition-colors rounded-lg border border-white/5"
                >
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click handled securely */}
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: UI structure */}
                  <div
                    className="w-full flex flex-row items-center justify-between px-3 py-3 cursor-pointer gap-4"
                    onClick={() =>
                      setExpandedAlertIndex(
                        expandedAlertIndex === idx ? null : idx,
                      )
                    }
                  >
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <Image
                        src={`https://openweathermap.org/img/wn/11d@2x.png`}
                        alt="weather icon"
                        height={40}
                        width={40}
                        className="drop-shadow-md shrink-0"
                      />
                      <div className="flex flex-col flex-1">
                        <p className="font-bold text-sm line-clamp-2">
                          {peringatan.title}
                        </p>
                        <p className="text-xs mt-1">
                          {new Intl.DateTimeFormat("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZoneName: "short",
                          }).format(new Date(peringatan.pubDate))}
                        </p>
                      </div>
                    </div>

                    <IconChevronDown
                      className={`w-5 h-5 shrink-0 opacity-70 transition-transform duration-300 ease-in-out ${
                        expandedAlertIndex === idx ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      expandedAlertIndex === idx
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="md:overflow-hidden overflow-auto">
                      <div className="px-4 pb-4 pt-2 text-sm border-t border-white/10 bg-background/75">
                        <p className="opacity-90 leading-relaxed text-left text-foreground">
                          {peringatan.description}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-foreground flex flex-row gap-2 items-center justify-center">
                            <p>Sumber:</p>
                            <a
                              className="font-bold text-primary hover:underline"
                              href="https://www.bmkg.go.id/"
                            >
                              BMKG
                            </a>
                          </div>
                          <a
                            href={peringatan.link}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md text-xs font-semibold transition-colors"
                          >
                            Details
                          </a>
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
