import { createClient } from "@/lib/supabase/client";

interface Analysis {
  id?: string | null;
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
    .select("id, status, content, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
  }

  const analysisData = (data?.[0] as Analysis) || ({} as Analysis);

  return analysisData;
}
