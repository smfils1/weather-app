const backupIcons = require('../../src/utils/icons').backupIcons
window.addEventListener("load", () => {
  const geolocator = navigator.geolocation;
  
  const onPositionReceived = ({ coords: { latitude, longitude } }) => {
    fetch(`http://localhost:3000/weather?lat=${latitude}&long=${longitude}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.error) {
          return changeWeatherInfo(data,data.error);
        }
        changeWeatherInfo(data);
        createIcon(data);
      });
  };

  if (geolocator) {
    geolocator.getCurrentPosition(onPositionReceived, undefined);
  }
});
const changeWeatherInfo = (data,error) => {
  const elements = document.querySelectorAll(".weatherInfo");
  if(error){
    return elements.forEach((item)=>{
      item.textContent = (item.id === "address")? error: "N/A"
    })
  }
  elements.forEach(item => {
    item.textContent =
      data.location[item.id] !== undefined
        ? data.location[item.id]
        : data.currently[item.id];
    if (item.id === "precipProbability") {
      item.textContent = Number(item.textContent) * 100;
    }
  });
};

const weatherForm = document.querySelector("#weatherForm");
weatherForm.addEventListener("submit", e => {
  e.preventDefault();
  const search = document.querySelector("#search");

  const location = search.value;

  fetch(`http://localhost:3000/weather?address=${location}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.error) {
        return changeWeatherInfo(data,data.error);
      }
      changeWeatherInfo(data);
      createIcon(data);
    });
});
const createIcon = data => {

  const mainIcon = document.getElementById("main-icon");
  const backupIcon = document.getElementById("backup-icon");
  const icon = data.currently.icon;
  if (backupIcons[icon]) {
    backupIcon.style.display = "inline-block";
    mainIcon.style.display = "none";
    backupIcon.classList= "";
    backupIcon.classList.add("icon","wi", backupIcons[icon]);
  } else {
    backupIcon.style.display = "none";
    mainIcon.style.display = "inline-block";
    let skycons = new Skycons({ color: "white", resizeClear: true });
    skycons.set("main-icon", icon);
    skycons.play();
  }
};

let placesAutocomplete = places({
  appId: process.env.ALGOLIA_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  container: document.querySelector("#search"),
  autocompleteOptions: {
    autoselect: false
  }
});
