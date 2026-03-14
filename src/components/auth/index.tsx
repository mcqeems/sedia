import Link from "next/link";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function AuthContainer({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>

      {children}

      <div className="mt-6 flex flex-col gap-4 text-sm">
        <p className="text-zinc-600">
          {footerText}{" "}
          <Link
            href={footerLink}
            className="font-medium text-zinc-900 hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
        <Link href="/" className="text-zinc-600 hover:text-zinc-900">
          Back to home
        </Link>
      </div>
    </main>
  );
}

export function AuthInput({
  id,
  name,
  type,
  label,
  placeholder,
  required,
  minLength,
  autoComplete,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-offset-2 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
        placeholder={placeholder}
      />
    </div>
  );
}

export function AuthSubmitButton({
  idleText,
  pendingText,
}: {
  idleText: string;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingText : idleText}
    </button>
  );
}

export function AuthMessage({
  state,
}: {
  state: { status: "idle" | "success" | "error"; message: string };
}) {
  if (!state.message) return null;

  return (
    <p
      className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
        state.status === "error"
          ? "border-red-300 bg-red-50 text-red-700"
          : "border-emerald-300 bg-emerald-50 text-emerald-700"
      }`}
    >
      {state.message}
    </p>
  );
}
