"use client";

import { IconMapPinFilled } from "@tabler/icons-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

// Menggunakan TopoJSON dengan resolusi 50m agar bentuk detail pulau-pulau terlihat dengan baik
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

interface MapChartProps {
  latitude: number;
  longitude: number;
}

export default function MapChart({ latitude, longitude }: MapChartProps) {
  // Jika koordinat belum tersedia (kasus loading awal), hindari error map dengan null return
  if (!latitude || !longitude) return null;

  return (
    <div className="h-full w-full bg-background/10 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        style={{ width: "100%", height: "100%" }}
      >
        {/* 
          ZoomableGroup memungkinkan fitur "bisa diperluas (expandable/pan)".
          Mengatur zoom ke angka besar (misal 14) dan center pada letak koodinat Gempa,
          agar secara default Map memfokuskan / zoom in pada pulau/titik tersebut saja.
        */}
        <ZoomableGroup
          center={[longitude, latitude]}
          zoom={15}
          minZoom={15}
          maxZoom={50}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#ffffff"
                  fillOpacity={0.2}
                  stroke="#ffffff"
                  strokeOpacity={0.8}
                  strokeWidth={0.2}
                  style={{
                    default: {
                      outline: "none",
                      transition: "all 100ms ease-in-out",
                    },
                    hover: {
                      outline: "none",
                      fillOpacity: 0.4,
                      strokeOpacity: 1,
                      transition: "all 100ms ease-in-out",
                    },
                    pressed: {
                      outline: "none",
                      transition: "all 100ms ease-in-out",
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Marker Titik Lokasi */}
          <Marker coordinates={[longitude, latitude]}>
            <IconMapPinFilled
              height={2}
              width={2}
              className="text-background border-2 drop-shadow-2xl shadow-2xl"
            />
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
