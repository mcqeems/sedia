import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Navbar from "@/components/protected/Navbar";
import DashProvider from "@/context/dashContext";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <DashProvider>
      <header className="relative">
        <Navbar />
      </header>
      <main>{children}</main>
      <footer></footer>
    </DashProvider>
  );
}
