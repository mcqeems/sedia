import PrakiraanCuaca from "./PrakiraanCuaca";
import WeatherCard from "./WeatherCard";

export default function Tops() {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      {/* Left Side */}
      <div className="flex w-full flex-col gap-2 md:max-w-lg">
        <WeatherCard />

        <PrakiraanCuaca />

        <div className="h-[125px] w-full rounded-lg bg-primary p-4 text-primary-foreground">
          Kabar Gempa bumi terbaru
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full flex-col gap-2">
        <div className="min-h-[300px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:h-full">
          Map
        </div>
        <div className="min-h-[250px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:h-full">
          AI Analysis
        </div>
      </div>
    </div>
  );
}
