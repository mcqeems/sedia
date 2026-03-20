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

export type DashAction =
  | { type: "SET_STATE"; payload: Partial<DashboardContents> }
  | { type: "SET_STATUS"; payload: DashboardStates["status"] };

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
      return { ...state, status: action.payload };
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
