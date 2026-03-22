"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";
import type { WeatherResponse } from "@/lib/dashboard/tops/getWeatherPrediction";
import getWeatherPrediction from "@/lib/dashboard/tops/getWeatherPrediction";
import getProfile from "@/lib/supabase/getProfile";

export default function PrakiraanCuaca() {
  const { dispatch, state } = useDashContext();
  const [predictionData, setPredictionData] = useState<WeatherResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (state.state.displayLocation) {
        try {
          setLoading(true);
          const userData = await getProfile();
          const response = await getWeatherPrediction({
            adm: state.state.adm4 || userData.adm_4,
            displayLocation:
              state.state.displayLocation || userData.display_location,
          });

          // If the utility fetched a new ADM4 string, save it back to our context
          if (response.newAdm) {
            dispatch({ type: "SET_STATE", payload: { adm4: response.newAdm } });
          }

          setPredictionData(response.data);
        } catch (error) {
          console.error("Error fetching predictions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPrediction();
  }, [state.state.displayLocation, state.state.adm4, dispatch]);

  if (loading) {
    return (
      <div className="flex h-[300px] w-full rounded-lg bg-primary/50 overflow-hidden shadow-xl">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-lg bg-primary p-4 text-primary-foreground shadow-xl overflow-hidden">
      <h3 className="font-bold mb-4">Prakiraan Cuaca selama 3 hari</h3>
      {/* TODO: Map your predictionData below */}
      <pre className="text-xs overflow-auto h-[220px]">
        {JSON.stringify(predictionData, null, 2)}
      </pre>
    </div>
  );
}
