const URL = "https://corona.lmao.ninja/v2/";
let map;
let infoWindow;
let markers = [];
let mykey = "AIzaSyDmZQImxjUjMf3-nX8m4h30SMNp-LqS1p4";

let script = document.createElement("script");

script.src = `https://maps.googleapis.com/maps/api/js?key=${mykey}&callback=initMap`;
script.defer = true;
script.async = true;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 2,
  });
  infoWindow = new google.maps.InfoWindow();
}

document.body.appendChild(script);

window.onload = function () {
  getGlobalData();
  getCountryMarkers();
};

getCountryMarkers = () => {
  const FULL_URL = "https://corona.lmao.ninja/v2/countries?yesterday=&sort=";

  const globalPromise = fetch(FULL_URL);

  globalPromise
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showCountryMarkers(data);
    });
};

const onEnter = (e) => {
  if (e.key === "Enter") {
    getCountryData();
  }
};

getCountryData = (country = "") => {
  if (country == "") {
    country = document.getElementById("search-country").value;
  }
  const FULL_URL = `${URL}countries/${country}?yesterday=true&strict=true&query`;

  const globalPromise = fetch(FULL_URL);

  globalPromise
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      showCountryData(data);
    });
};

showCountryData = (countryData) => {
  document.getElementById(
    "country"
  ).innerText = `${countryData.country.toUpperCase()}`;
  document.getElementById(
    "flag"
  ).innerHTML = `<img src='${countryData.countryInfo.flag}' alt='Country flag'>`;
  document.getElementById(
    "today-country-cases"
  ).innerText = `NEW CASES: ${countryData.todayCases}`;
  document.getElementById(
    "today-country-deaths"
  ).innerText = `NEW DEATHS: ${countryData.todayDeaths}`;
  document.getElementById(
    "active-cases"
  ).innerText = `ACTIVE CASES: ${countryData.active}`;
};

function showCountryMarkers(countries) {
  let totalCases = 0;
  let recovered = 0;
  let totalDeaths = 0;
  let name;
  var bounds = new google.maps.LatLngBounds();
  countries.forEach(function (country, index) {
    var latlng = new google.maps.LatLng(
      country.countryInfo.lat,
      country.countryInfo.long
    );
    name = country.country;
    totalCases = country.cases;
    totalDeaths = country.deaths;
    recovered = country.recovered;
    createMarker(latlng, name, totalCases, totalDeaths, recovered, index);
    bounds.extend(latlng);
  });
  map.panToBounds(bounds);
}

function createMarker(latlng, name, totalCases, totalDeaths, recovered, index) {
  let country = name;
  var html = `<h3>${country}</h3>
                <p>Total cases: ${totalCases}</p>
                <p>Total Deaths: ${totalDeaths}</p>
                <p>Recovered: ${recovered}</p>
                `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: "\u29BF",
  });

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
    getCountryData(country);
  });

  markers.push(marker);
}
