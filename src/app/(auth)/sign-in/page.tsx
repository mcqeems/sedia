"use client";

import { useActionState } from "react";

import {
  AuthContainer,
  AuthInput,
  AuthMessage,
  AuthSubmitButton,
} from "@/components/auth";

import { signInWithPassword } from "./actions";

const initialSignInState = {
  status: "idle",
  message: "",
} satisfies Awaited<ReturnType<typeof signInWithPassword>>;

export default function SignInPage() {
  const [state, formAction] = useActionState(
    signInWithPassword,
    initialSignInState,
  );

  return (
    <AuthContainer
      title="Welcome back"
      description="Sign in to your account with your email and password."
      footerText="Don't have an account?"
      footerLink="/sign-up"
      footerLinkText="Sign up"
    >
      <form className="mt-8 space-y-4" action={formAction}>
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
          autoComplete="current-password"
          required
        />

        <AuthSubmitButton idleText="Sign in" pendingText="Signing in..." />
      </form>

      <AuthMessage state={state} />
    </AuthContainer>
  );
}
