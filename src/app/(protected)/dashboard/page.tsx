import type { Metadata } from "next";
import HeaderPage from "@/components/protected/HeaderPage";
import Inside from "./components/Inside";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-4">
      <HeaderPage
        title="My Dashboard"
        description="Pantau kondisi cuaca dan bencana di lokasi anda."
      />
      <Inside />
    </div>
  );
}
