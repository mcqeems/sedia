"use client";

import { IconHome, IconLogout, IconMessageCircle } from "@tabler/icons-react";
import Image from "next/image";
import { RedirectType, redirect, usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type IconProps = {
  className?: string;
};

interface Navigations {
  name: string;
  title?: string;
  action: () => void | Promise<void>;
  icon: ComponentType<IconProps>;
}

export default function Navbar() {
  const supabase = createClient();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>("");

  const navigations: Navigations[] = [
    {
      name: "dashboard",
      title: "Redirect ke Dashboard.",
      action: () => {
        redirect("/dashboard", RedirectType.push);
      },
      icon: IconHome,
    },
    {
      name: "chat",
      title: "Redirect ke Chat.",
      action: () => {
        redirect("/chat", RedirectType.push);
      },
      icon: IconMessageCircle,
    },
    {
      name: "logout",
      title: "Keluar dari akun anda.",
      action: () => {
        const logout = async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error("Error signing out: ", error.cause);
          }
        };
        logout();
        redirect("/", RedirectType.push);
      },
      icon: IconLogout,
    },
  ];

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:left-15 md:translate-x-0 md:-translate-y-1/2 rounded-4xl md:px-3.5 md:py-4 px-4 py-2 overflow-hidden z-50 bg-primary/80 hover:scale-105 transition-all ease-in shadow-2xl">
      <Image
        loading="eager"
        src="/bg-nav.jpeg"
        alt="nav page"
        fill
        className="absolute -z-10 top-0 left-0 opacity-30"
      />
      <div className="flex md:flex-col flex-row md:gap-3 gap-2">
        {navigations.map((nav) => {
          const Icon = nav.icon;

          return (
            <button
              key={nav.name}
              type="button"
              onClick={nav.action}
              title={nav.title}
              aria-label={nav.name}
              className={`rounded-full p-2 ${currentPath === `/${nav.name.toLowerCase()}` ? "bg-background/80 hover:bg-background/90" : "bg-background/0 hover:bg-background/30"} cursor-pointer drop-shadow-2xl shadow-2xl transition hover:scale-110 border border-background/10`}
            >
              <Icon className="w-6 h-6 text-foreground/60 antialiased" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
