import { createClient } from "@/lib/supabase/client";

interface Analysis {
  status?: string | null;
  content?: string | null;
  updated_at?: string | null;
}

export default async function getAnalysis() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return {} as Analysis;
  }

  const { data, error } = await supabase
    .from("analysis")
    .select("status, content, updated_at")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
  }

  const analysisData = (data as Analysis) || ({} as Analysis);

  return analysisData;
}
