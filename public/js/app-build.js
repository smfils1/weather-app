(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
const backupIcons = require('../../src/utils/icons').backupIcons
window.addEventListener("load", () => {
  const geolocator = navigator.geolocation;
  
  const onPositionReceived = ({ coords: { latitude, longitude } }) => {
    fetch(`/weather?lat=${latitude}&long=${longitude}`)
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

  fetch(`/weather?address=${location}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.error) {
        return changeWeatherInfo(data,"Can't find location");
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

}).call(this,require('_process'))
},{"../../src/utils/icons":3,"_process":1}],3:[function(require,module,exports){
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
},{}]},{},[2]);
