import AiAnalysis from "./AiAnalysis";
import CurrentMap from "./CurrentMap";
import GempaBumi from "./GempaBumi";
import PrakiraanCuaca from "./PrakiraanCuaca";
import WeatherCard from "./WeatherCard";

export default function Tops() {
  return (
    <div className="flex w-full flex-col gap-2 md:h-[565px] md:flex-row">
      {/* Left Side */}
      <div className="flex h-full w-full flex-col gap-2 md:max-w-lg">
        <div className="md:min-h-0 md:flex-1">
          <WeatherCard />
        </div>
        <PrakiraanCuaca />
        <GempaBumi />
      </div>

      {/* Right Side */}
      <div className="flex h-full w-full flex-col gap-2 md:min-h-0">
        <div className="min-h-[275px] md:min-h-0 md:flex-1">
          <CurrentMap />
        </div>
        <AiAnalysis />
      </div>
    </div>
  );
}
