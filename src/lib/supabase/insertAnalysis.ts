"use server";

import { createClient } from "@/lib/supabase/server";

interface Content {
  headline: string;
  analysis_detail: string;
  potential_risks: string[] | string;
  action_steps: string[] | string;
  urgency_level: number;
}

interface Analysis {
  status?: string | null;
  content?: string | Content;
}

export default async function insertAnalysis({ status, content }: Analysis) {
  const supabase = await createClient();
  const nowIsoString = new Date().toISOString();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    console.error("No active user found to insert analysis.");
    return false;
  }

  const { error } = await supabase.from("analysis").insert({
    user_id: user.id,
    status: status,
    content: content,
    updated_at: nowIsoString,
  });

  if (error) {
    console.error("Error while inserting database: ", error);
    throw new Error("Failed to insert analysis");
  }

  return true;
}
