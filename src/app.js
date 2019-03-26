require("dotenv").config();
const request = require("request");

const express = require("express");
const path = require("path");

const geoCode = require("../src/utils/geocode");
const forecast = require("../src/utils/forecast");
const icons = require("./utils/icons").icons;
const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.enable('trust proxy')


app.get("/", (req, res) => {
  let url = `${req.protocol}://${req.get('host')}${req.originalUrl}weather/?ip=${req.ip}`;
  request({ url, json: true }, (err, response) => {
    if (err) {     
      
      //Low level Error like no internet

      res.render("index", {
        error: "Can't Connect to Geo Service",
        weather: undefined,
        icon: undefined
      });
    } else if (response.body.error) {
      //Request Error
      res.render("index", {
        error: response.body.error,
        weather: undefined,
        icon: undefined
      });
    } else {
      const weather = response.body;
      res.render("index", {
        weather,
        error: undefined,
        icon: icons[weather.currently.icon]
      });
    }
  });
});


app.get("/weather", (req, res) => {
  const { address, ip, lat, long } = req.query;
  if (!address && !ip && (!lat && !long)) {
    return res.send({
      error: "Enter an address, ip, OR lat and long option"
    });
  }
  const location = {
    address,
    coords: { lat, long },
    ip
  };
  geoCode(location, (error, { lat, long, location } = {}) => {
    //res is destructed
    if (error) {
      res.send({ error });
    } else {
      forecast({ lat, long }, (error, results) => {
        if (error) {
          res.send({ error });
        } else {
          const {
            temperature,
            apparentTemperature,
            precipProbability,
            summary,
            windSpeed,
            icon
          } = results.currently;
          res.send({
            location: {
              geoCode: {
                lat,
                long
              },
              address: location
            },

            currently: {
              temperature,
              apparentTemperature,
              precipProbability,
              summary,
              windSpeed,
              icon
            }
          });
        }
      });
    }
  });
});

app.use((req, res) => {
  res.render("404");
});

app.listen(process.env.PORT || 3000);
