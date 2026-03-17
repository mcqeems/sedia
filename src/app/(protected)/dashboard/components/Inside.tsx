"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Loader from "@/components/protected/Loader";

export default function Inside() {
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
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* Inside Dashbord */}
      <section className="space-x-2 space-y-2 py-2">
        {/* Location */}
        <div className="flex flex-row gap-2 p-2 w-full rounded-lg border border-border">
          <div className="w-full max-w-full py-2 font-medium">Provinsi:</div>
          <div className="w-full max-w-full py-2 font-medium">Kabupaten:</div>
          <div className="w-full max-w-full py-2 font-medium">Kecamatan:</div>
          <div className="w-full max-w-full py-2 font-medium">Kelurahan:</div>
        </div>
        {/* Tops */}
        <div className="flex md:flex-row flex-col gap-2 w-full">
          {/* Left Side */}
          <div className="flex flex-col w-full max-w-full md:max-w-lg gap-2 rounded-lg">
            <div className="w-full h-[125px] bg-primary rounded-lg">
              Cuaca Hari ini
            </div>
            <div className="w-full h-[300px] bg-primary rounded-lg">
              Prakiraan Cuaca selama 3 hari
            </div>
            <div className="w-full h-[125px] bg-primary rounded-lg">
              Kabar Gempa bumi terbaru
            </div>
          </div>
          {/* Right Side */}
          <div className="flex flex-col w-full max-w-full gap-2">
            <div className="w-full h-full bg-primary rounded-lg">Map</div>
            <div className="w-full h-full bg-primary rounded-lg">
              AI Analysis
            </div>
          </div>
        </div>
        {/* Bottoms */}
        <div className="flex md:flex-row flex-col gap-2 w-full">
          <div className="h-[150px] w-full md:max-w-[50%] max-w-full bg-primary rounded-lg">
            Berita peringatan cuaca
          </div>
          <div className="h-[150px] w-full md:max-w-[50%] max-w-full bg-primary rounded-lg">
            Berita 15 gempa terakhir dengan magnitudo 5+
          </div>
        </div>
      </section>
    </>
  );
}
