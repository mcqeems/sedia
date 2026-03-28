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
      title="Buat akun Anda"
      description="Daftar dengan email dan kata sandi anda."
      footerText="Sudah punya akun?"
      footerLink="/sign-in"
      footerLinkText="Masuk"
    >
      <form className="mt-8 space-y-4" action={formAction}>
        <AuthInput
          id="first-name"
          name="first-name"
          type="text"
          label="Nama Depan"
          placeholder="John"
          autoComplete="given-name"
          required
        />
        <AuthInput
          id="last-name"
          name="last-name"
          type="text"
          label="Nama Belakang"
          placeholder="Doe"
          autoComplete="family-name"
        />
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
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          required
          minLength={6}
        />

        <AuthSubmitButton
          idleText="Daftar"
          pendingText="Sedang membuat akun..."
        />
      </form>

      <AuthMessage state={state} />

      <p className="mt-4 text-xs text-zinc-500">* Harus diisi.</p>
    </AuthContainer>
  );
}
