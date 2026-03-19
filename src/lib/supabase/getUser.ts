import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserMetadata = {
  email: string;
  first_name: string;
  last_name: string;
};

export type ExtendedUser = User & {
  user_metadata: UserMetadata;
};

export default async function getUser() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const extendedUser = user as ExtendedUser;

  return extendedUser;
}
