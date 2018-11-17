
const BASE_URL = process.env.REACT_APP_API_URL

const API_ROOT = `http://${ BASE_URL }`;
export const API_WS_ROOT = `ws://${ BASE_URL }/cable`;
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
