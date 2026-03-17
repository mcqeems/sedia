import Image from "next/image";

export default function HeaderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="w-full px-2 py-4 gap-0 md:gap-1 flex flex-col justify-center items-center rounded-2xl relative overflow-hidden">
      <h1 className="text-3xl">{title}</h1>
      <p className="text-muted-foreground font-medium">{description}</p>
      <Image
        src="/bg-page.png"
        alt="background page"
        width={1300}
        height={300}
        className="absolute -z-10 top-0"
      />
    </section>
  );
}
