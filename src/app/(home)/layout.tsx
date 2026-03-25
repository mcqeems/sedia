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
      <main className="mt-24">{children}</main>
    </>
  );
}
