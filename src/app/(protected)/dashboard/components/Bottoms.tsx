import BeritaPeringatanCuaca from "./BeritaPeringatanCuaca";

export default function Bottoms() {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <BeritaPeringatanCuaca />
      <div className="h-[180px] w-full rounded-lg bg-primary p-4 text-primary-foreground md:max-w-[50%]">
        Berita 15 gempa terakhir dengan magnitudo 5+
      </div>
    </div>
  );
}
