import MapChart from "@/components/protected/MapCharts";
import Skeleton from "@/components/Skeleton";
import { useDashContext } from "@/context/dashContext";

export default function CurrentMap() {
  const { state } = useDashContext();

  return (
    <>
      {!state.state.latitude && !state.state.longitude ? (
        <div className="flex h-full w-full min-h-[275px] rounded-lg bg-primary/50 overflow-hidden md:min-h-0">
          <Skeleton />
        </div>
      ) : (
        <div className="h-full w-full min-h-[275px] rounded-lg bg-primary p-4 text-primary-foreground overflow-hidden md:min-h-0">
          <MapChart
            latitude={Number(state.state.latitude)}
            longitude={Number(state.state.longitude)}
          />
        </div>
      )}
    </>
  );
}
