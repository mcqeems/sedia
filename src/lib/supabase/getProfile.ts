import { createClient } from "@/lib/supabase/client";

interface GetProfile {
  display_location?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  adm_4?: string;
  langitude?: string;
  longitude?: string;
}

export default async function getProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return {} as GetProfile;
  }

  const { data, error } = await supabase
    .from("profile")
    .select(
      "display_location, provinsi, kabupaten, kecamatan, kelurahan, adm_4, langitude, longitude",
    )
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
  }

  const profileData = (data as GetProfile) || ({} as GetProfile);

  return profileData;
}
