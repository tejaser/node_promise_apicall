const axios = require("axios");
const yargs = require("yargs");

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: "address",
      describe: "address to get weather info.",
      string: true
    }
  })
  .help()
  .alias("help", "h").argv;

const mapkey = "<google maps api key>";
const tempkey = "<dark sky api key>";

var encodedAddress = encodeURIComponent(argv.address);
let geoCodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${mapkey}`;

axios
  .get(geoCodeURL)
  .then(response => {
    if (response.data.status === "ZERO_RESULTS") {
      throw new Error("unable to find the address.");
    }

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    let weatherURL = `https://api.darksky.net/forecast/${tempkey}/${lat},${lng}?units=si`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherURL);
  })
  .then(response => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(
      `It's currently ${temperature}C.  It feels like ${apparentTemperature}C`
    );
  })
  .catch(e => {
    if (e.code === "ENOTFOUND") {
      console.log("Unable to connect to API servers.");
    } else {
      console.log(e.message);
    }
  });
