"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

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

  return <div className="flex flex-col items-start gap-6 p-8"></div>;
}
