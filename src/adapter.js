const API_ROOT = 'https://tempapi-backend.herokuapp.com';
export const API_WS_ROOT = 'wss://tempapi-backend.herokuapp.com/cable';
// const HEADERS = {
//   'Content-Type': 'application/json',
//   Accept: 'application/json',
// };

export function getLocations(callback) {
  fetch(`${ API_ROOT }/locations`)
    .then(res => res.json())
    .then(callback);
}

export function getReadings(locationId, callback) {
  fetch(`${ API_ROOT }/locations/${ locationId }/readings`)
    .then(res => res.json())
    .then(callback);
}
