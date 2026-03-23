import { IconHome } from "@tabler/icons-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:left-10 md:translate-x-0 md:-translate-y-1/2 rounded-2xl p-4 overflow-hidden z-50 bg-primary/80">
      <Image
        loading="eager"
        src="/bg-nav.jpeg"
        alt="nav page"
        fill
        className="absolute -z-10 top-0 left-0 opacity-30"
      />
      <div className="flex md:flex-col flex-row md:gap-4 gap-2">
        <button
          className="rounded-full p-2 bg-background/80 drop-shadow-2xl shadow-2xl"
          type="button"
        >
          <IconHome className="w-6 h-6 text-foreground/65 antialiased" />
        </button>
      </div>
    </nav>
  );
}
