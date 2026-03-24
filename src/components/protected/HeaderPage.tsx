import Image from "next/image";

export default function HeaderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="w-full px-2 py-4 gap-0 md:gap-1 bg-primary/20 flex flex-col justify-center items-center rounded-2xl relative overflow-hidden">
      <h1 className="md:text-3xl text-xl text-center">{title}</h1>
      <p className="text-muted-foreground text-center font-medium md:text-base text-sm">
        {description}
      </p>
      <Image
        loading="eager"
        src="/bg-page.png"
        alt="background page"
        width={1300}
        height={300}
        className="absolute -z-10 top-0"
      />
    </section>
  );
}
