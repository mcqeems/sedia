import Inside from "./components/Inside";

import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      {/* Header Page */}
      <section className="w-full px-2 py-4 gap-0 md:gap-1 flex flex-col justify-center items-center rounded-2xl relative overflow-hidden">
        <h1 className="text-3xl">My Dashboard</h1>
        <p className="text-muted-foreground font-medium">
          Pantau kondisi cuaca dan bencana di lokasi anda.
        </p>
        <Image
          src="/bg-page.png"
          alt="background page"
          width={1300}
          height={300}
          className="absolute -z-10 top-0"
        />
      </section>
      <Inside />
    </div>
  );
}
