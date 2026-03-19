"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type SignUpState = {
  status: "idle" | "success" | "error";
  message: string;
};

async function insertProfile(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("profile").insert({
    user_id: userId,
  });

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true };
}

export async function signUpWithPassword(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const firstName = String(formData.get("first-name") ?? "").trim();
  const lastName = String(formData.get("last-name") ?? "").trim();

  const options = {
    data: {
      first_name: firstName,
      last_name: lastName,
    },
  };

  if (!email || !password) {
    return {
      status: "error",
      message: "Email and password are required.",
    };
  }

  if (password.length < 6) {
    return {
      status: "error",
      message: "Password must be at least 6 characters.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.user && data.session) {
    const profileResult = await insertProfile(data.user.id);

    if (!profileResult.success) {
      return {
        status: "error",
        message: `Account created, but failed to create profile: ${profileResult.message}`,
      };
    }

    redirect("/dashboard");
  }

  return {
    status: "success",
    message: "Signup request created, but no session was returned.",
  };
}
