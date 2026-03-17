"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Loader from "@/components/protected/Loader";
import getGeoLocation from "@/lib/dashboard/getGeoLocation";
import getGreeting from "@/lib/dashboard/getGreeting";

type UserMetadata = {
  email: string;
  first_name: string;
  last_name: string;
};

type ExtendedUser = User & {
  user_metadata: UserMetadata;
};

export default function Inside() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize the browser Supabase client
  const supabase = createClient();
  const greeting = getGreeting();

  useEffect(() => {
    // 1. Example: Fetching user data on the client side
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const extendedUser = user as ExtendedUser;

      console.log(extendedUser.user_metadata.first_name);
      setUser(extendedUser);
      setLoading(false);
    };

    getUser();
    getGeoLocation();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-3 py-2">
      {/* Location */}
      <div className="flex w-full flex-col justify-between rounded-lg border border-border p-2 md:flex-row">
        <div className="flex flex-row">
          <p>
            {greeting}, {user?.user_metadata.first_name}!{" "}
          </p>
          <span>👋</span>
        </div>
        <div className="flex flex-row">
          <span>👋</span>
          <p>
            {greeting}, {user?.user_metadata.first_name}!{" "}
          </p>
        </div>
      </div>

      {/* Tops */}
      <div className="flex w-full flex-col gap-2 md:flex-row">
        {/* Left Side */}
        <div className="flex w-full flex-col gap-2 rounded-lg md:max-w-lg">
          <div className="h-[125px] w-full rounded-lg bg-primary p-4 text-primary-foreground">
            Cuaca Hari ini
          </div>
          <div className="h-[300px] w-full rounded-lg bg-primary p-4 text-primary-foreground">
            Prakiraan Cuaca selama 3 hari
          </div>
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

      {/* Bottoms */}
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="h-[150px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:max-w-[50%]">
          Berita peringatan cuaca
        </div>
        <div className="h-[150px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:max-w-[50%]">
          Berita 15 gempa terakhir dengan magnitudo 5+
        </div>
      </div>
    </section>
  );
}
