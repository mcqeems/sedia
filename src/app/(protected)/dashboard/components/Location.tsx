"use client";

import {
  IconCurrentLocation,
  IconMapPin,
  IconPencil,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { useDashContext } from "@/context/dashContext";
import getAdmCode from "@/lib/dashboard/location/getAdmCode";
import reverseGeoLocation from "@/lib/dashboard/location/reverseGeoLocation";
import getProfile from "@/lib/supabase/getProfile";
import type { ExtendedUser } from "@/lib/supabase/getUser";
import updateProfile from "@/lib/supabase/updateProfile";

export default function Location({
  greeting,
  user,
  geo,
}: {
  greeting: string;
  user: ExtendedUser | null;
  geo: { latitude: string | null; longitude: string | null } | null;
}) {
  const dashContext = useDashContext();

  useEffect(() => {
    const fetchLocationData = async () => {
      const profile = await getProfile();

      if (profile?.adm_4 && profile?.display_location) {
        dashContext.dispatch({
          type: "SET_STATE",
          payload: { displayLocation: profile.display_location },
        });
      } else {
        if (!geo?.latitude || !geo?.longitude) {
          dashContext.dispatch({
            type: "SET_STATE",
            payload: { displayLocation: "Location unavailable" },
          });
          return;
        }

        const { latitude, longitude } = geo;

        const data = await reverseGeoLocation({
          latitude,
          longitude,
        });

        if (data) {
          dashContext.dispatch({
            type: "SET_STATE",
            payload: { displayLocation: profile.display_location },
          });
          try {
            const code = await getAdmCode(data.display_name);
            await updateProfile({
              displayLocation: data.display_name,
              langitude: latitude,
              longitude: longitude,
              adm4: code,
            });
          } catch (err) {
            console.error("Failed to get adm code", err);
          }
        } else {
          dashContext.dispatch({
            type: "SET_STATE",
            payload: { displayLocation: "Location unavailable" },
          });
        }
      }
    };

    fetchLocationData();
  }, [geo, dashContext]);

  return (
    <div className="flex w-full flex-col md:justify-between justify-center items-center rounded-lg border border-border p-2 md:flex-row text-muted-foreground">
      <div className="flex flex-row items-center gap-1">
        <p>
          {greeting}, {user?.user_metadata.first_name}!
        </p>
        <span>👋</span>
      </div>

      <div className="flex flex-row items-center gap-2 mt-2 md:mt-0">
        <span className="flex items-center justify-center shrink-0 ">
          <IconMapPin height={20} width={20} />
        </span>
        <div className="text-sm md:text-right">
          <p className="line-clamp-2 max-w-sm">
            {dashContext.state.state.displayLocation}
          </p>
        </div>
        <div className="flex flex-row gap-1">
          <button
            className="h-[30px] w-[30px] rounded-full hover:bg-primary/25 transition-all cursor-pointer border border-primary/50 text-primary/50 flex justify-center items-center"
            type="button"
            title="Get the newest location with your gps."
          >
            <IconCurrentLocation height={20} width={20} />
          </button>
          <button
            className="h-[30px] w-[30px] rounded-full hover:bg-primary/25 transition-all cursor-pointer border border-primary/50 text-primary/50 flex justify-center items-center"
            type="button"
            title="Change your location manually."
          >
            <IconPencil height={20} width={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
