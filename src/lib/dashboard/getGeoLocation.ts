export default function getGeoLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos: GeolocationPosition) {
    const crd = pos.coords;

    return {
      latitude: crd.latitude,
      longitude: crd.longitude,
    };
  }

  function error(err: GeolocationPositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}
