import MapChart from "@/components/protected/MapCharts";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";

export default function CurrentMap() {
  const { state } = useDashContext();

  return (
    <>
      {!state.state.latitude && !state.state.longitude ? (
        <div className="flex w-full min-h-[300px] rounded-lg bg-primary/50 overflow-hidden">
          <Skeleton />
        </div>
      ) : (
        <div className="max-h-[300px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:h-full">
          <MapChart
            latitude={Number(state.state.latitude)}
            longitude={Number(state.state.longitude)}
          />
        </div>
      )}
    </>
  );
}
