const request = require("request");

var geoCodeAddress = address => {
  var encodedAddress = encodeURIComponent(address);
  const key = <put in your google map api key here>;

  let formatedURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${key}`;
  console.log(encodedAddress);
  return new Promise((resolve, reject) => {
    request(
      {
        url: formatedURL,
        json: true
      },
      (error, response, body) => {
        if (!error && body.status === "OK") {
          resolve({
            address: body.results[0].formatted_address,
            lattitude: body.results[0].geometry.location.lat,
            longitude: body.results[0].geometry.location.lng
          });
        } else if (body.status === "ZERO_RESULTS") {
          reject("Could not get the address details.");
        } else if (error) {
          reject("Could not connect to google api.");
        }
      }
    );
  });
};

geoCodeAddress("40 orient colony bhuj").then(
  location => {
    console.log(JSON.stringify(location, undefined, 2));
  },
  errorMessage => {
    console.log(errorMessage);
  }
);
