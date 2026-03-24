import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface GetProfile {
  display_location?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  adm_4?: string;
  langitude?: string;
  longitude?: string;
}

type GetProfileOptions = {
  userId?: string;
  supabase?: SupabaseClient;
};

export default async function getProfile(options: GetProfileOptions = {}) {
  const supabase = options.supabase ?? createClient();
  let userId = options.userId;

  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    userId = user?.id;
  }

  if (!userId) {
    return {} as GetProfile;
  }

  const { data, error } = await supabase
    .from("profile")
    .select(
      "display_location, provinsi, kabupaten, kecamatan, kelurahan, adm_4, langitude, longitude",
    )
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error);
  }

  const profileData = (data as GetProfile) || ({} as GetProfile);

  return profileData;
}
