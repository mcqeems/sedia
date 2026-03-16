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
      <section className="w-full px-2 py-4 gap-0 md:gap-1 flex flex-col justify-center items-center rounded-2xl relative overflow-hidden">
        <h1 className="text-3xl">My Dashboard</h1>
        <p className="text-muted-foreground">
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
    </div>
  );
}
