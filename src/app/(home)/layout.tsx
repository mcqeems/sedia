import Navbar from "@/components/home/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="mt-24 w-full max-w-6xl mx-auto">{children}</main>
    </>
  );
}
