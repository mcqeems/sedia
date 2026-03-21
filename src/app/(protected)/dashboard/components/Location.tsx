"use client";

import {
  IconCurrentLocation,
  IconMapPin,
  IconPencil,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDashContext } from "@/context/dashContext";
import getAdmCode from "@/lib/dashboard/location/getAdmCode";
import reverseGeoLocation from "@/lib/dashboard/location/reverseGeoLocation";
import getProfile from "@/lib/supabase/getProfile";
import type { ExtendedUser } from "@/lib/supabase/getUser";
import updateProfile from "@/lib/supabase/updateProfile";

type Region = { code: string; name: string };

function AutocompleteInput({
  id,
  label,
  value,
  onChange,
  onSelect,
  onFocus,
  onBlur,
  disabled = false,
  placeholder,
  isOpen,
  isLoading,
  items,
  emptyMessage,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  onSelect: (item: Region) => void;
  onFocus: () => void;
  onBlur: () => void;
  disabled?: boolean;
  placeholder: string;
  isOpen: boolean;
  isLoading: boolean;
  items: Region[];
  emptyMessage: string;
}) {
  return (
    <div className="relative flex flex-col gap-2 group">
      <label
        htmlFor={id}
        className={`text-sm font-medium ${disabled ? "text-muted-foreground" : ""}`}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50"
      />
      {/* Dropdown Selection */}
      <div
        className={`absolute top-full left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-background shadow-md ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-all duration-200`}
      >
        <ul className="flex flex-col py-1 text-sm">
          {isLoading ? (
            <li className="px-3 py-2 text-muted-foreground italic text-xs">
              Memuat data...
            </li>
          ) : items.length === 0 ? (
            <li className="px-3 py-2 text-muted-foreground italic text-xs">
              {emptyMessage}
            </li>
          ) : (
            items.map((item) => (
              <li
                key={item.code}
                className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(item);
                }}
              >
                {item.name}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default function Location({
  greeting,
  user,
  geo,
}: {
  greeting: string;
  user: ExtendedUser | null;
  geo: { latitude: string | null; longitude: string | null } | null;
}) {
  const [openChangeLocation, setOpenChangeLocation] = useState(false);
  const [selectedProvinsi, setSelectedProvinsi] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [inputProvinsi, setInputProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [inputKabupaten, setInputKabupaten] = useState("");

  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [regencies, setRegencies] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingRegencies, setIsLoadingRegencies] = useState(false);
  const [openDropdownProvincies, setOpenDropdownProvincies] = useState(false);
  const [openDropdownRegencies, setOpenDropdownRegencies] = useState(false);

  const { dispatch, state } = useDashContext();

  useEffect(() => {
    if (openChangeLocation && provinces.length === 0) {
      const fetchProvinces = async () => {
        setIsLoadingProvinces(true);
        try {
          const res = await fetch("/api/wilayah/provinces.json");
          const json = await res.json();
          setProvinces(json.data || []);
        } catch (err) {
          console.error("Failed to fetch provinces", err);
        } finally {
          setIsLoadingProvinces(false);
        }
      };
      fetchProvinces();
    }
  }, [openChangeLocation, provinces.length]);

  useEffect(() => {
    if (selectedProvinsi?.code) {
      const fetchRegencies = async () => {
        setIsLoadingRegencies(true);
        try {
          const res = await fetch(
            `/api/wilayah/regencies/${selectedProvinsi.code}.json`,
          );
          const json = await res.json();
          setRegencies(json.data || []);
        } catch (err) {
          console.error("Failed to fetch regencies", err);
        } finally {
          setIsLoadingRegencies(false);
        }
      };
      fetchRegencies();
    } else {
      setRegencies([]);
      setSelectedKabupaten(null);
      setInputKabupaten("");
    }
  }, [selectedProvinsi]);

  useEffect(() => {
    const fetchLocationData = async () => {
      const profile = await getProfile();

      if (profile?.adm_4 && profile?.display_location) {
        dispatch({
          type: "SET_STATE",
          payload: { displayLocation: profile.display_location },
        });
      } else {
        if (!geo?.latitude || !geo?.longitude) {
          dispatch({
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
          try {
            const code = await getAdmCode(data.display_name);
            await updateProfile({
              displayLocation: data.display_name,
              langitude: latitude,
              longitude: longitude,
              adm4: code,
            });
            dispatch({
              type: "SET_STATE",
              payload: { displayLocation: profile.display_location },
            });
          } catch (err) {
            console.error("Failed to get adm code", err);
          }
        } else {
          dispatch({
            type: "SET_STATE",
            payload: { displayLocation: "Location unavailable" },
          });
        }
      }
    };

    fetchLocationData();
  }, [geo, dispatch]);

  async function handleUpdateLocation() {
    dispatch({
      type: "SET_STATE",
      payload: { displayLocation: "Updating location..." },
    });

    const profile = await getProfile();

    if (!geo?.latitude || !geo?.longitude) {
      dispatch({
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
      try {
        const code = await getAdmCode(data.display_name);
        await updateProfile({
          displayLocation: data.display_name,
          langitude: latitude,
          longitude: longitude,
          adm4: code,
        });
        dispatch({
          type: "SET_STATE",
          payload: { displayLocation: profile.display_location },
        });
      } catch (err) {
        console.error("Failed to get adm code", err);
      }
    } else {
      dispatch({
        type: "SET_STATE",
        payload: { displayLocation: "Location unavailable" },
      });
    }
  }

  function handleOpenChangeLocation() {
    if (!openChangeLocation) {
      setOpenChangeLocation(true);
    } else {
      setOpenChangeLocation(false);
      setSelectedProvinsi(null);
      setSelectedKabupaten(null);
      setInputProvinsi("");
      setInputKabupaten("");
    }
  }

  const filteredProvinces = provinces.filter((p) =>
    p.name.toLowerCase().includes(inputProvinsi.toLowerCase()),
  );

  const filteredRegencies = regencies.filter((r) =>
    r.name.toLowerCase().includes(inputKabupaten.toLowerCase()),
  );

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
          <p className="line-clamp-2 max-w-sm">{state.state.displayLocation}</p>
        </div>
        <div className="flex flex-row gap-1">
          <button
            className="h-[30px] w-[30px] rounded-full hover:bg-primary/25 transition-all cursor-pointer border border-primary/50 text-primary/50 flex justify-center items-center"
            type="button"
            title="Get the newest location with your gps."
            onClick={handleUpdateLocation}
          >
            <IconCurrentLocation height={20} width={20} />
          </button>
          <button
            className="h-[30px] w-[30px] rounded-full hover:bg-primary/25 transition-all cursor-pointer border border-primary/50 text-primary/50 flex justify-center items-center"
            type="button"
            title="Change your location manually."
            onClick={handleOpenChangeLocation}
          >
            <IconPencil height={20} width={20} />
          </button>
        </div>
      </div>

      {openChangeLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/** biome-ignore lint/a11y/noStaticElementInteractions: why not */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: why not */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleOpenChangeLocation}
          ></div>
          <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl border border-border p-6 flex flex-col gap-4 z-10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Ubah Lokasi</h3>
              <button
                type="button"
                onClick={handleOpenChangeLocation}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <AutocompleteInput
              id="provinsi"
              label="Masukkan Provinsi:"
              value={inputProvinsi}
              onChange={(val) => {
                setInputProvinsi(val);
                if (val === "") setSelectedProvinsi(null);
              }}
              onSelect={(prov) => {
                setSelectedProvinsi(prov);
                setInputProvinsi(prov.name);
                setOpenDropdownProvincies(false);
              }}
              onFocus={() => setOpenDropdownProvincies(true)}
              onBlur={() => setOpenDropdownProvincies(false)}
              placeholder="Cari provinsi..."
              isOpen={openDropdownProvincies}
              isLoading={isLoadingProvinces}
              items={filteredProvinces}
              emptyMessage="Provinsi tidak ditemukan..."
            />

            <AutocompleteInput
              id="kabupaten"
              label="Masukkan Kota/Kabupaten:"
              value={inputKabupaten}
              onChange={(val) => {
                setInputKabupaten(val);
                if (val === "") setSelectedKabupaten(null);
              }}
              onSelect={(reg) => {
                setSelectedKabupaten(reg);
                setInputKabupaten(reg.name);
                setOpenDropdownRegencies(false);
              }}
              onFocus={() => setOpenDropdownRegencies(true)}
              onBlur={() => setOpenDropdownRegencies(false)}
              disabled={!selectedProvinsi}
              placeholder={
                selectedProvinsi
                  ? "Cari kota/kabupaten..."
                  : "Pilih provinsi terlebih dahulu"
              }
              isOpen={openDropdownRegencies && !!selectedProvinsi}
              isLoading={isLoadingRegencies}
              items={filteredRegencies}
              emptyMessage="Kota/Kabupaten tidak ditemukan..."
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
