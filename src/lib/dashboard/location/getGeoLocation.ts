export default function getGeoLocation(): Promise<{
  latitude: string;
  longitude: string;
}> {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  return new Promise((resolve, reject) => {
    function success(pos: GeolocationPosition) {
      const crd = pos.coords;

      resolve({
        latitude: crd.latitude.toString(),
        longitude: crd.longitude.toString(),
      });
    }

    function error(err: GeolocationPositionError) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      reject(err);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  });
}
