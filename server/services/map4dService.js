const fetch = require("node-fetch");
const MAP4D_CONFIG = require("../config/map4d");

const key = MAP4D_CONFIG.API_KEY;
const base = MAP4D_CONFIG.BASE_URL;

exports.getRoute = async (origin, destination) => {
  const url = `${base}/route?key=${key}&origin=${origin}&destination=${destination}`;
  const res = await fetch(url);
  return res.json();
};

exports.getMatrix = async (origins, destinations) => {
  const url = `${base}/route/matrix?key=${key}&origins=${origins}&destinations=${destinations}`;
  const res = await fetch(url);
  return res.json();
};

exports.getAutoSuggest = async (text, location, acronym) => {
  const url = `${base}/autosuggest?key=${key}&text=${encodeURIComponent(text)}${
    location ? `&location=${location}` : ""
  }${acronym ? `&acronym=${acronym}` : ""}`;
  const res = await fetch(url);
  return res.json();
};

exports.getPlaceDetail = async (id) => {
  const url = `${base}/place/detail/${id}?key=${key}`;
  const res = await fetch(url);
  return res.json();
};

exports.getTextSearch = async (text, types, datetime, location) => {
  const url = `${base}/place/text-search?key=${key}&text=${encodeURIComponent(text)}${
    types ? `&types=${types}` : ""
  }${datetime ? `&datetime=${datetime}` : ""}${location ? `&location=${location}` : ""}`;
  const res = await fetch(url);
  return res.json();
};

exports.getNearbySearch = async (location, radius, text, types, tags, datetime) => {
  const url = `${base}/place/nearby-search?key=${key}&location=${location}${
    radius ? `&radius=${radius}` : ""
  }${text ? `&text=${encodeURIComponent(text)}` : ""}${types ? `&types=${types}` : ""}${
    tags ? `&tags=${tags}` : ""
  }${datetime ? `&datetime=${datetime}` : ""}`;
  const res = await fetch(url);
  return res.json();
};

exports.getViewboxSearch = async (viewbox, text, types, tags, datetime) => {
  const url = `${base}/place/viewbox-search?key=${key}&viewbox=${viewbox}${
    text ? `&text=${encodeURIComponent(text)}` : ""
  }${types ? `&types=${types}` : ""}${tags ? `&tags=${tags}` : ""}${
    datetime ? `&datetime=${datetime}` : ""
  }`;
  const res = await fetch(url);
  return res.json();
};

exports.getGeocodeV2 = async (address, location, viewbox) => {
  const url = `${base}/v2/geocode?key=${key}${
    address ? `&address=${encodeURIComponent(address)}` : ""
  }${location ? `&location=${location}` : ""}${viewbox ? `&viewbox=${viewbox}` : ""}`;
  const res = await fetch(url);
  return res.json();
};
