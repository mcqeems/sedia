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
      title="Selamat datang kembali"
      description="Masuk ke akun Anda menggunakan email dan kata sandi."
      footerText="Belum punya akun?"
      footerLink="/sign-up"
      footerLinkText="Daftar"
    >
      <form className="mt-8 space-y-4" action={formAction}>
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="john.doe@email.com"
          autoComplete="email"
          required
        />
        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Kata Sandi"
          autoComplete="current-password"
          required
        />

        <AuthSubmitButton idleText="Masuk" pendingText="Sedang masuk..." />
      </form>

      <AuthMessage state={state} />
    </AuthContainer>
  );
}
