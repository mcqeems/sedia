import KabupatenData from "@/data/kabupaten.json";
import KecamatanData from "@/data/kecamatan.json";
import KelurahanDataRaw from "@/data/kelurahan.json";
import ProvinsiData from "@/data/provinsi.json";

type Kelurahan = {
  id: number;
  kecamatan_id: number;
  name: string;
};

const KelurahanData = KelurahanDataRaw as Kelurahan[];

export default function getAdmCode({
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
}: {
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
}) {
  // Pronvisi
  const getProvinsi = ProvinsiData.find(({ name }) => name === provinsi);
  const getProvinsiId = getProvinsi?.id;

  // Kabupaten
  const filterKabupaten = KabupatenData.filter(
    ({ provinsi_id }) => provinsi_id === getProvinsiId,
  );
  const getKabupaten = filterKabupaten.find(({ name }) =>
    name.toLowerCase().includes(kabupaten.toLowerCase()),
  );
  const getKabupatenId = getKabupaten?.id;

  // Kecamatan
  const filterKecamatan = KecamatanData.filter(
    ({ kabupaten_id }) => kabupaten_id === getKabupatenId,
  );
  const getKecamatan = filterKecamatan.find(({ name }) =>
    name.toLowerCase().includes(kecamatan.toLowerCase()),
  );
  const getKecamatanId = getKecamatan?.id;

  // Kelurahan
  const filterKelurahan = KelurahanData.filter(
    ({ kecamatan_id }) => kecamatan_id === getKecamatanId,
  );
  const getKelurahan = filterKelurahan.find(({ name }) =>
    name.toLowerCase().includes(kelurahan.toLowerCase()),
  );
  const getKelurahanId = getKelurahan?.id;

  const convertToAdmCode = (id: number | undefined) => {
    if (!id) return "";

    const idStringify = id.toString();
    const formatter = `${idStringify[0]}${idStringify[1]}.${idStringify[2]}${idStringify[3]}.${idStringify[4]}${idStringify[5]}.${idStringify[6]}${idStringify[7]}${idStringify[8]}${idStringify[9]}`;

    return formatter;
  };

  return convertToAdmCode(getKelurahanId);
}
