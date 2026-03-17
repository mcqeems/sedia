"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize the browser Supabase client
  const supabase = createClient();

  useEffect(() => {
    // 1. Example: Fetching user data on the client side
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

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
      {/* Inside Dashbord */}
      <section className="space-x-2 space-y-2 py-2">
        {/* Location */}
        <div className="flex flex-row gap-2 p-2 bg-accent/50 w-full">
          <div className="w-full max-w-full py-2 bg-primary font-medium">
            Provinsi:
          </div>
          <div className="w-full max-w-full py-2 bg-primary font-medium">
            Kabupaten:
          </div>
          <div className="w-full max-w-full py-2 bg-primary font-medium">
            Kecamatan:
          </div>
          <div className="w-full max-w-full py-2 bg-primary font-medium">
            Kelurahan:
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-2 w-full">
          {/* Left Side */}
          <div className="flex flex-col w-full max-w-full md:max-w-lg bg-accent/50 gap-2">
            <div className="w-full h-[150px] bg-primary"></div>
            <div className="w-full h-[300px] bg-primary"></div>
            <div className="w-full h-[150px] bg-primary"></div>
          </div>
          {/* Right Side */}
          <div className="flex flex-col w-full max-w-full bg-accent/50 gap-2">
            <div className="w-full h-full bg-primary"></div>
            <div className="w-full h-full bg-primary"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
