"use client";

import type React from "react";
import { createContext, useContext, useReducer } from "react";
import type { WeatherAlert } from "@/lib/dashboard/bottoms/getPeringatanCuaca";
import type { EarthquakeData } from "@/lib/dashboard/tops/getGempa";

interface DashboardContents {
  displayLocation: string | undefined;
  adm4: string | undefined;
  latitude: string | undefined;
  longitude: string | undefined;
  gempaInfo: EarthquakeData | undefined;
  peringatanCuaca: WeatherAlert | undefined;
}

interface Status {
  loadingWeather: boolean;
  loadingPrediction: boolean;
  loadingEarthquake: boolean;
  loadingWeatherWarning: boolean;
  loadingEarthquakeNews: boolean;
  loadingMap: boolean;
  loadingAi: boolean;
}

interface DashboardStates {
  state: DashboardContents;
  status: Status;
}

const defaultDash: DashboardStates = {
  state: {
    displayLocation: "Loading location...",
    adm4: undefined,
    latitude: undefined,
    longitude: undefined,
    gempaInfo: undefined,
    peringatanCuaca: undefined,
  },
  status: {
    loadingWeather: true,
    loadingPrediction: true,
    loadingEarthquake: true,
    loadingWeatherWarning: true,
    loadingEarthquakeNews: true,
    loadingMap: true,
    loadingAi: true,
  },
};

export type DashAction =
  | { type: "SET_STATE"; payload: Partial<DashboardContents> }
  | { type: "SET_STATUS"; payload: Partial<DashboardStates["status"]> };

interface DashContextType {
  state: DashboardStates;
  dispatch: React.Dispatch<DashAction>;
}

const DashContext = createContext<DashContextType | undefined>(undefined);

function dashReducer(
  state: DashboardStates,
  action: DashAction,
): DashboardStates {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, state: { ...state.state, ...action.payload } };
    case "SET_STATUS":
      return { ...state, status: { ...state.status, ...action.payload } };
    default:
      return state;
  }
}

export default function DashProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(dashReducer, defaultDash);

  return (
    <DashContext.Provider value={{ state, dispatch }}>
      {children}
    </DashContext.Provider>
  );
}

export const useDashContext = () => {
  const context = useContext(DashContext);
  if (!context) {
    throw new Error("useDashContext must be used within a DashProvider");
  }
  return context;
};
