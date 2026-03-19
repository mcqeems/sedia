"use server";

import { createClient } from "@/lib/supabase/server";

interface UpdateProfile {
  displayLocation?: string | null;
  provinsi?: string | null;
  kabupaten?: string | null;
  kecamatan?: string | null;
  kelurahan?: string | null;
  adm4?: string | null;
  langitude?: string | null;
  longitude?: string | null;
}

export default async function updateProfile({
  displayLocation,
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  adm4,
  langitude,
  longitude,
}: UpdateProfile) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    console.error("No active user found to update profile.");
    return;
  }

  const { error } = await supabase
    .from("profile")
    .update({
      display_location: displayLocation,
      provinsi: provinsi,
      kabupaten: kabupaten,
      kecamatan: kecamatan,
      kelurahan: kelurahan,
      adm_4: adm4,
      langitude: langitude,
      longitude: longitude,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
  }
}
