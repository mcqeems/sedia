"use server";

import { createClient } from "@/lib/supabase/server";

type SignUpState = {
  status: "idle" | "success" | "error";
  message: string;
};

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
    if (error.code === "over_email_send_rate_limit") {
      return {
        status: "error",
        message:
          "Your project is still trying to send confirmation emails and hit a send limit. Disable email confirmation in Supabase Auth settings if you want instant signup with no verification.",
      };
    }

    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.session) {
    return {
      status: "success",
      message: "Account created and signed in.",
    };
  }

  return {
    status: "success",
    message:
      "Signup request created, but no session was returned. Disable email confirmation in Supabase Auth settings for no-verification signup.",
  };
}
