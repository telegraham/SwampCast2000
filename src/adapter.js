const API_ROOT = 'http://localhost:3000';
const API_WS_ROOT = 'ws://localhost:3000/cable';
const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

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
