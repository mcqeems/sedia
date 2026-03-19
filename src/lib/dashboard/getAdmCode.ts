import ProvinsiData from "@/data/provinsi.json";
import KabupatenData from "@/data/kabupaten.json";
import KecamatanData from "@/data/kecamatan.json";
import KelurahanData from "@/data/kelurahan.json";

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
  const getProvinsi = ProvinsiData.find(({ name }) => name === provinsi);
  const getProvinsiId = getProvinsi?.id;

  const filterKabupaten = KabupatenData.filter(
    ({ provinsi_id }) => provinsi_id === getProvinsiId,
  );
  const getKabupaten = filterKabupaten.find(({ name }) =>
    name.toLowerCase().includes(kabupaten.toLowerCase()),
  );
  const getKabupatenId = getKabupaten?.id;

  const filterKecamatan = KecamatanData.filter(
    ({ kabupaten_id }) => kabupaten_id === getKabupatenId,
  );
  const getKecamatan = filterKecamatan.find(({ name }) =>
    name.toLowerCase().includes(kecamatan.toLowerCase()),
  );
  const getKecamatanId = getKecamatan?.id;

  const filterKelurahan = KelurahanData.filter(
    ({ kecamatan_id }) => kecamatan_id === getKecamatanId,
  );
  const getKelurahan = filterKelurahan.find(({ name }) =>
    name.toLowerCase().includes(kelurahan.toLowerCase()),
  );
  const getKelurahanId = getKelurahan?.id;
}
