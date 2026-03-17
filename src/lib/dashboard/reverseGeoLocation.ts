interface Address {
  state: string;
  county: string;
  city: string;
  city_district: string;
  municipality: string;
  suburb: string;
  district: string;
  village: string;
  hamlet: string;
  neighbourhood: string;
  locality: string;
}

interface Response {
  display_name: string;
  address: Address;
}

export default async function reverseGeoLocation({
  latitude,
  longitude,
}: {
  latitude: string;
  longitude: string;
}) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Response = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Reverse geolocation failed:", error);
    return null;
  }
}
