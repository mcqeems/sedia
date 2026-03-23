import BeritaGempa from "./BeritaGempa";
import BeritaPeringatanCuaca from "./BeritaPeringatanCuaca";

export default function Bottoms() {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <BeritaPeringatanCuaca />
      <BeritaGempa />
    </div>
  );
}
