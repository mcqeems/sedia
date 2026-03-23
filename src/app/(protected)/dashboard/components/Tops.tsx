import AiAnalysis from "./AiAnalysis";
import CurrentMap from "./CurrentMap";
import GempaBumi from "./GempaBumi";
import PrakiraanCuaca from "./PrakiraanCuaca";
import WeatherCard from "./WeatherCard";

export default function Tops() {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      {/* Left Side */}
      <div className="flex h-full md:max-h-[575px] w-full flex-col gap-2 md:max-w-lg">
        <WeatherCard />
        <PrakiraanCuaca />
        <GempaBumi />
      </div>

      {/* Right Side */}
      <div className="flex h-full md:max-h-[575px] w-full flex-col gap-2">
        <CurrentMap />
        <AiAnalysis />
      </div>
    </div>
  );
}
