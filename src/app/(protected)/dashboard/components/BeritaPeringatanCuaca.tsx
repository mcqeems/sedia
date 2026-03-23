"use client";

import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import getPeringatanCuaca, {
  type WeatherAlert,
} from "@/lib/dashboard/bottoms/getPeringatanCuaca";

export default function BeritaPeringatanCuaca() {
  const [isLoading, setIsLoading] = useState(true);
  const [peringatanCuaca, setPeringatanCuaca] = useState<WeatherAlert[]>();
  const { dispatch } = useDashContext();

  useEffect(() => {
    const fetchPeringatan = async () => {
      const response = await getPeringatanCuaca();
      setPeringatanCuaca(response);
      dispatch({
        type: "SET_STATE",
        payload: { peringatanCuaca: response[0] },
      });
      setIsLoading(false);
    };

    fetchPeringatan();
  }, [dispatch]);

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
      <div className="md:mt-2 mt-3 flex flex-col items-center gap-2">
        {peringatanCuaca && (
          <div className="w-full h-full flex flex-row justify-between items-center px-2 py-4 bg-background/10 hover:bg-background/20 transition-colors rounded-lg">
            <Image
              src={`https://openweathermap.org/img/wn/11d@2x.png`}
              alt="weather icon"
              height={50}
              width={50}
              className="drop-shadow-md"
            />
            <p className="font-bold text-sm">{peringatanCuaca[0].title}</p>
            <p className="text-xs">
              {new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(peringatanCuaca[0].pubDate))}
            </p>
          </div>
        )}
        <div className="w-full max-w-[150px] p-2 bg-background/10 rounded-2xl hover:bg-background/20 transition-colors cursor-pointer flex flex-row gap-1 items-center justify-center">
          <IconPlus className="w-3.5 h-3.5" />
          <p className="text-center text-sm">Lihat lebih banyak</p>
        </div>
      </div>
    </div>
  );
}
