const request = require("request");

const geoCode = (location, callback) => {
  const {
    address,
    coords: { lat, long }
  } = location;
  if (address || (lat && long)) {
    return mapGeoCode(location, callback);
  }

  ipGeoCode(callback);
};

const mapGeoCode = ({ address, coords }, callback) => {
  const option = coords.lat ? `${coords.long},${coords.lat}` : address;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${option}.json?access_token=${
    process.env.MAPBOX_KEY
  }&limit=1`;

  request({ url, json: true }, (err, res) => {
    if (err) {
      //Low level Error like no internet
      callback("Can't Connect to Geo Service");
    } else if (res.body.features.length === 0) {
      //Request Error
      callback("Can't find location");
    } else {
      const data = res.body;
      callback(undefined, {
        location: data.features[0].place_name,
        lat: data.features[0].center[1],
        long: data.features[0].center[0]
      });
    }
  });
};

const ipGeoCode = callback => {
  const url = `http://ip-api.com/json/`;

  request({ url, json: true }, (err, res) => {
    if (err) {
      //Low level Error like no internet
      callback("Can't Connect to Geo Service");
    } else if (res.status === "fail") {
      //Request Error
      callback("Can't find location");
    } else {
      const data = res.body;
      callback(undefined, {
        location: `${data.city}, ${data.regionName}`,
        lat: data.lat,
        long: data.lon
      });
    }
  });
};
module.exports = { geoCode, ipGeoCode, mapGeoCode };
