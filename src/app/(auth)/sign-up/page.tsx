"use client";

import { useActionState } from "react";

import {
  AuthContainer,
  AuthInput,
  AuthMessage,
  AuthSubmitButton,
} from "@/components/auth";

import { signUpWithPassword } from "./actions";

const initialSignUpState = {
  status: "idle",
  message: "",
} satisfies Awaited<ReturnType<typeof signUpWithPassword>>;

export default function SignUpPage() {
  const [state, formAction] = useActionState(
    signUpWithPassword,
    initialSignUpState,
  );

  return (
    <AuthContainer
      title="Create your account"
      description="Sign up with email and password using Supabase Auth."
      footerText="Already have an account?"
      footerLink="/sign-in"
      footerLinkText="Sign in"
    >
      <form className="mt-8 space-y-4" action={formAction}>
        <AuthInput
          id="first-name"
          name="first-name"
          type="text"
          label="First Name"
          placeholder="John"
          autoComplete="given-name"
          required
        />
        <AuthInput
          id="last-name"
          name="last-name"
          type="text"
          label="Last Name"
          placeholder="Doe"
          autoComplete="family-name"
        />
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          required
          minLength={6}
        />

        <AuthSubmitButton
          idleText="Sign up"
          pendingText="Creating account..."
        />
      </form>

      <AuthMessage state={state} />

      <p className="mt-4 text-xs text-zinc-500">
        This form is set for no-verification signup. If you still get
        confirmation-email related errors, disable Confirm email in Supabase
        Auth settings.
      </p>
    </AuthContainer>
  );
}
