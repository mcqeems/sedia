"use client";

import { useEffect, useReducer } from "react";
import Loader from "@/components/protected/Loader";
import getGeoLocation from "@/lib/dashboard/location/getGeoLocation";
import getGreeting from "@/lib/dashboard/location/getGreeting";
import type { ExtendedUser } from "@/lib/supabase/getUser";
import getUser from "@/lib/supabase/getUser";
import Bottoms from "./Bottoms";
import Location from "./Location";
import Tops from "./Tops";

type State = {
  user: ExtendedUser | null;
  loadingUser: boolean;
  geo: { latitude: string; longitude: string } | null;
};

type Action =
  | { type: "SET_USER"; payload: ExtendedUser }
  | { type: "SET_GEO"; payload: { latitude: string; longitude: string } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loadingUser: false };
    case "SET_GEO":
      return { ...state, geo: action.payload };
    default:
      return state;
  }
}

export default function Inside() {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    loadingUser: true,
    geo: null,
  });

  const greeting = getGreeting();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        dispatch({ type: "SET_USER", payload: userData });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    const fetchGeo = async () => {
      try {
        const geoData = await getGeoLocation();
        dispatch({ type: "SET_GEO", payload: geoData });
      } catch (err) {
        console.error("Failed to get geolocation:", err);
      }
    };

    fetchUser();
    fetchGeo();
  }, []);

  if (state.loadingUser) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-3 py-2">
      <Location greeting={greeting} user={state.user} geo={state.geo} />
      <Tops />
      <Bottoms />
    </section>
  );
}
