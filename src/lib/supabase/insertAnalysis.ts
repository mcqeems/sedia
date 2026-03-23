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
  status?: string | null;
  content?: string | Content;
}

export default async function insertAnalysis({ status, content }: Analysis) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    console.error("No active user found to insert analysis.");
    return;
  }

  const { error } = await supabase
    .from("analysis")
    .insert({
      status: status,
      content: content,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error while inserting database: ", error);
  }
}
