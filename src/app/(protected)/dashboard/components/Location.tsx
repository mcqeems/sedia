"use client";

import { IconMapPin } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import getAdmCode from "@/lib/dashboard/getAdmCode";
import reverseGeoLocation from "@/lib/dashboard/reverseGeoLocation";
import type { ExtendedUser } from "@/lib/supabase/getUser";

export default function Location({
  greeting,
  user,
  geo,
}: {
  greeting: string;
  user: ExtendedUser | null;
  geo: { latitude: string; longitude: string } | null;
}) {
  const [displayName, setDisplayName] = useState<string>("Loading location...");
  const [admCode, setAdmCode] = useState<string | null>(null);

  useEffect(() => {
    if (!geo) return;

    const fetchLocationData = async () => {
      const data = await reverseGeoLocation({
        latitude: geo.latitude,
        longitude: geo.longitude,
      });

      if (data) {
        setDisplayName(data.display_name);

        const { address } = data;
        const provinsi = address.state || "";
        const kabupaten =
          address.county || address.city || address.city_district || "";
        const kecamatan =
          address.municipality || address.suburb || address.district || "";
        const kelurahan =
          address.village ||
          address.hamlet ||
          address.neighbourhood ||
          address.locality ||
          "";

        console.log();

        try {
          const code = getAdmCode({
            provinsi,
            kabupaten,
            kecamatan,
            kelurahan,
          });
          setAdmCode(code);
        } catch (err) {
          console.error("Failed to get adm code", err);
        }
      } else {
        setDisplayName("Location unavailable");
      }
    };

    fetchLocationData();
  }, [geo]);

  return (
    <div className="flex w-full flex-col justify-between rounded-lg border border-border p-2 md:flex-row md:items-center">
      <div className="flex flex-row items-center gap-1">
        <p>
          {greeting}, {user?.user_metadata.first_name}!
        </p>
        <span>👋</span>
      </div>

      <div className="flex flex-row items-center gap-2 mt-2 md:mt-0">
        <span className="flex items-center justify-center shrink-0">
          <IconMapPin height={20} width={20} />
        </span>
        <div className="text-sm md:text-right">
          <p className="line-clamp-2 max-w-sm">{displayName}</p>
          {admCode && (
            <span className="text-xs text-zinc-500">Adm. Code: {admCode}</span>
          )}
        </div>
      </div>
    </div>
  );
}
