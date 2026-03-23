"use server";

import { createClient } from "@/lib/supabase/server";

interface Content {
  headline: string;
  analysis_detail: string;
  potential_riks: string[] | string;
  action_steps: string[] | string;
  urgency_level: number;
}

interface Analysis {
  status: string;
  content: string | Content;
}

export default async function updateAnalysis({ status, content }: Analysis) {
  const supabase = await createClient();
  const nowIsoString = new Date().toISOString();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    console.error("No active user found to update analysis.");
    return;
  }

  const { error } = await supabase
    .from("analysis")
    .update({
      status: status,
      content: content,
      updated_at: nowIsoString,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error while updating database: ", error);
  }
}
