"use client";

import {
  IconCurrentLocation,
  IconDotsVertical,
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
  reset,
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
  reset: () => void;
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
      <div>
        <div className="relative w-full">
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
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50 pr-8"
          />
          {value && !disabled && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                reset();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-sm focus:outline-none"
              aria-label="Clear input"
            >
              ✕
            </button>
          )}
        </div>
      </div>

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
  const [openActionOptions, setOpenActionOptions] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showMissingGeoPopup, setShowMissingGeoPopup] = useState(false);
  const [forceManual, setForceManual] = useState(false);

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
          payload: {
            displayLocation: profile.display_location,
            latitude: profile.langitude,
            longitude: profile.longitude,
          },
        });
      } else {
        if (!geo?.latitude || !geo?.longitude) {
          dispatch({
            type: "SET_STATE",
            payload: { displayLocation: "Location unavailable" },
          });
          setShowMissingGeoPopup(true);
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
              payload: {
                displayLocation: data.display_name,
                latitude: latitude,
                longitude: longitude,
              },
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

  async function handleSaveChangeLocation() {
    if (!selectedKabupaten || !selectedProvinsi) return;
    setIsLoadingSave(true);
    setErrorMsg("");

    interface Geo {
      name: string;
      lat: number;
      lon: number;
      country: string;
      state: string;
    }

    try {
      // Clean up "Kota" and "Kabupaten" prefixes (case-insensitive) for better geocoding results
      const cleanKabupatenName = selectedKabupaten.name
        .replace(/^(kota\s+|kabupaten\s+)/i, "")
        .trim();

      const getGeo = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cleanKabupatenName},${selectedProvinsi.name},ID&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`,
      );

      if (!getGeo.ok) {
        throw new Error(`Geocoding failed: ${getGeo.statusText}`);
      }

      const geoData: Geo[] = await getGeo.json();

      if (geoData && geoData.length > 0) {
        dispatch({
          type: "SET_STATE",
          payload: {
            latitude: geoData[0].lat.toString(),
            longitude: geoData[0].lon.toString(),
          },
        });

        const getDisplayLocation = await reverseGeoLocation({
          latitude: geoData[0].lat.toString(),
          longitude: geoData[0].lon.toString(),
        });

        const getAdm = await getAdmCode(getDisplayLocation?.display_name);

        dispatch({
          type: "SET_STATE",
          payload: {
            displayLocation: getDisplayLocation?.display_name,
            latitude: geoData[0].lat.toString(),
            longitude: geoData[0].lon.toString(),
            adm4: getAdm,
          },
        });

        await updateProfile({
          displayLocation: getDisplayLocation?.display_name,
          langitude: geoData[0].lat.toString(),
          longitude: geoData[0].lon.toString(),
          adm4: getAdm,
        });

        setForceManual(false);
        setOpenChangeLocation(false);
        setSelectedProvinsi(null);
        setSelectedKabupaten(null);
        setInputProvinsi("");
        setInputKabupaten("");
      } else {
        // Did not return lat/lon (City doesn't exist on OpenWeather API)
        setErrorMsg(
          "Mohon maaf lokasi ini belum tersedia, kami menyarankan untuk mengaktifkan lokasi anda agar lebih akurat. Dan anda bisa memilih lokasi lain disini apabila tidak bisa mengaktifkan lokasi anda.",
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat mencari lokasi. Silakan coba lagi.");
    } finally {
      setIsLoadingSave(false);
    }
  }

  function handleVerifyGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newGeo = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          };

          handleUpdateLocationWithCoords(newGeo.latitude, newGeo.longitude);
          setShowMissingGeoPopup(false);
          setForceManual(false);
        },
        (error) => {
          console.error("GPS Error:", error);
          setShowMissingGeoPopup(false);
          setForceManual(true);
          setOpenChangeLocation(true);
          setErrorMsg(
            "Gagal mendapatkan lokasi otomatis. Silakan atur lokasi secara manual.",
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      setShowMissingGeoPopup(false);
      setForceManual(true);
      setOpenChangeLocation(true);
      setErrorMsg(
        "Browser Anda tidak mendukung GPS. Silakan atur lokasi secara manual.",
      );
    }
  }

  function handleRequestGPSLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Triggers Native Fetch flow that naturally updates context & Supabase
          const newGeo = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          };

          handleUpdateLocationWithCoords(newGeo.latitude, newGeo.longitude);
          setForceManual(false);
          setOpenChangeLocation(false);
        },
        (error) => {
          console.error("GPS Error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setErrorMsg(
              "Mohon izinkan akses lokasi pada browser/perangkat Anda terlebih dahulu untuk menggunakan fitur ini.",
            );
          } else {
            setErrorMsg(
              "Gagal mendapatkan lokasi. Pastikan GPS aktif atau coba lagi.",
            );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      setErrorMsg("Browser Anda tidak mendukung fitur Geolocation GPS.");
    }
  }

  async function handleUpdateLocationWithCoords(lat: string, lon: string) {
    dispatch({
      type: "SET_STATE",
      payload: { displayLocation: "Updating location..." },
    });

    const data = await reverseGeoLocation({
      latitude: lat,
      longitude: lon,
    });

    if (data) {
      try {
        const code = await getAdmCode(data.display_name);
        await updateProfile({
          displayLocation: data.display_name,
          langitude: lat,
          longitude: lon,
          adm4: code,
        });
        dispatch({
          type: "SET_STATE",
          payload: {
            displayLocation: data.display_name,
            latitude: lat,
            longitude: lon,
          },
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
    if (forceManual) return;
    if (!openChangeLocation) {
      setErrorMsg(""); // Clear errors on fresh open
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

      <div className="relative flex flex-row items-center gap-2 mt-2 md:mt-0">
        <span className="flex items-center justify-center shrink-0 ">
          <IconMapPin height={20} width={20} />
        </span>
        <div className="text-sm md:text-right">
          <p className="line-clamp-2 max-w-sm md:max-w-lg">
            {state.state.displayLocation}
          </p>
        </div>

        {/* Dropdown Action Trigger */}
        <div className="flex">
          <button
            className={`h-[30px] w-[30px] rounded-full hover:bg-primary/25 transition-all outline-none cursor-pointer border flex justify-center items-center ${openActionOptions ? "bg-primary/25 border-primary text-primary" : "border-primary/50 text-primary/50"}`}
            type="button"
            title="Location options"
            onClick={() => setOpenActionOptions(!openActionOptions)}
            onBlur={() => setTimeout(() => setOpenActionOptions(false), 200)}
          >
            <IconDotsVertical height={20} width={20} />
          </button>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 top-full mt-1 w-48 bg-background border border-border shadow-lg rounded-xl flex flex-col z-50 overflow-hidden transition-all origin-top-right duration-200 ${
            openActionOptions
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            onClick={() => {
              setOpenActionOptions(false);
              handleRequestGPSLocation();
            }}
          >
            <IconCurrentLocation
              height={16}
              width={16}
              className="text-primary"
            />
            <span>Gunakan GPS Anda</span>
          </button>
          <div className="h-[1px] w-full bg-border" />
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            onClick={() => {
              setOpenActionOptions(false);
              handleOpenChangeLocation();
            }}
          >
            <IconPencil height={16} width={16} className="text-primary" />
            <span>Ubah Secara Manual</span>
          </button>
        </div>
      </div>

      {showMissingGeoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-border p-6 flex flex-col gap-4 z-10 text-center items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mt-2">
              <IconCurrentLocation size={24} />
            </div>
            <h3 className="text-lg font-semibold">Akses Lokasi Dibutuhkan</h3>
            <p className="text-sm text-muted-foreground">
              Untuk memberikan informasi yang lebih akurat, silahkan aktifkan
              akses lokasi pada browser/perangkat Anda.
            </p>
            <div className="flex flex-col gap-2 w-full mt-2">
              <button
                type="button"
                onClick={handleVerifyGeolocation}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Saya sudah mengaktifkan lokasi
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMissingGeoPopup(false);
                  setForceManual(true);
                  setErrorMsg("");
                  setOpenChangeLocation(true);
                }}
                className="w-full px-4 py-2 bg-transparent text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
              >
                Atur lokasi manual
              </button>
            </div>
          </div>
        </div>
      )}

      {openChangeLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/** biome-ignore lint/a11y/noStaticElementInteractions: why not */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: why not */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !forceManual && handleOpenChangeLocation()}
          ></div>
          <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl border border-border p-6 flex flex-col gap-4 z-10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Ubah Lokasi</h3>
              {!forceManual && (
                <button
                  type="button"
                  onClick={handleOpenChangeLocation}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Permanent Warning to encourage geolocation */}
            {!errorMsg && (
              <div className="bg-primary/10 text-primary p-3 rounded-md text-sm mb-2 flex items-start gap-2 border border-primary/20">
                <IconCurrentLocation className="shrink-0 mt-0.5" size={16} />
                <p>
                  Mengisi lokasi secara manual kurang direkomendasikan. Mohon
                  aktifkan akses lokasi perangkat Anda untuk informasi
                  terakurat.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-200 text-foreground p-3 border border-red-300 rounded-md text-sm mb-2 flex flex-col gap-2">
                <p>{errorMsg}</p>
                <button
                  type="button"
                  onClick={handleRequestGPSLocation}
                  className="bg-red-400 text-background hover:bg-red-500 px-3 py-1.5 rounded-md text-xs font-semibold w-fit flex items-center gap-1 transition-colors"
                >
                  <IconCurrentLocation size={14} /> Gunakan GPS Sekarang
                </button>
              </div>
            )}

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
              reset={() => {
                setInputProvinsi("");
                setSelectedProvinsi(null);
              }}
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
              reset={() => {
                setInputKabupaten("");
                setSelectedKabupaten(null);
              }}
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
                onClick={handleSaveChangeLocation}
                className={`px-4 py-2 ${isLoadingSave ? "bg-muted-foreground/50" : "bg-primary"} text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium`}
              >
                {isLoadingSave ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
