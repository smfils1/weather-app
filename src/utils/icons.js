const icons = {
  "clear-day": "wi-forecast-io-clear-day",
  "clear-night": "wi-forecast-io-clear-night",
  rain: "wi-forecast-io-rain",
  snow: "wi-forecast-io-snow",
  sleet: "wi-forecast-io-sleet",
  "wind": "wi-forecast-io-wind",
  fog: "wi-forecast-io-fog",
  cloudy: "wi-forecast-io-cloudy",
  "partly-cloudy-day": "wi-forecast-io-partly-cloudy-day",
  "partly-cloudy-night": "wi-forecast-io-partly-cloudy-night",
  hail: "wi-forecast-io-hail",
  thunderstorm: "wi-forecast-io-thunderstorm",
  tornado: "wi-forecast-io-tornado"
};

const backupIcons = (({hail,thunderstorm,tornado}) => ({hail,thunderstorm,tornado}))(icons)

module.exports = {
    icons,
    backupIcons
}