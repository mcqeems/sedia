"use client";

import type React from "react";
import { createContext, useContext, useReducer } from "react";

interface DashboardContents {
  displayLocation: string | undefined;
  adm4: string | undefined;
  latitude: string | undefined;
  longitude: string | undefined;
}

interface DashboardStates {
  state: DashboardContents;
  status:
    | "idle"
    | "loading-weather"
    | "loading-prediction"
    | "loading-earthquake"
    | "loading-weather-warning"
    | "loading-earthquake-news"
    | "loading-map"
    | "loading-ai"
    | "loading-all";
}

const defaultDash: DashboardStates = {
  state: {
    displayLocation: undefined,
    adm4: undefined,
    latitude: undefined,
    longitude: undefined,
  },
  status: "loading-all",
};

const DashContext = createContext<DashboardStates>(defaultDash);

export default function dashContext({
  children,
}: {
  children: React.ReactNode;
}) {
  <DashContext value={defaultDash}>{children}</DashContext>;
}

export const useDashContext = () => useContext(DashContext);
