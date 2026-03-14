import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Sedia</h1>
      <p className="mt-3 max-w-xl text-zinc-600">
        Supabase Auth is now configured with centralized client utilities for
        your Next.js app.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/sign-up"
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
        >
          Open sign up page
        </Link>
      </div>
    </main>
  );
}
