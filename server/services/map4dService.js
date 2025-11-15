import fetch from "node-fetch";
import MAP4D_CONFIG from "../config/map4d.js";

const key = MAP4D_CONFIG.API_KEY;
const base = MAP4D_CONFIG.BASE_URL;

export const getRoute = async (origin, destination, mode = "car") => {
  // Lưu ý: 1 số phiên bản Map4D cần 'vehicle=car' hoặc 'mode=car'. Tuỳ doc bạn dùng.
  // Dùng encodeURIComponent để tránh lỗi URL.
  const url =
    `${base}/route?key=${encodeURIComponent(key)}` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    `&mode=${encodeURIComponent(mode)}`;

  console.log("[Map4D:getRoute] URL =", url);

  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    console.error("[Map4D:getRoute] fetch error:", e);
    return { __upstreamError: true, status: 502, message: e?.message || "Fetch to Map4D failed" };
  }

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      return {
        __upstreamError: true,
        status: res.status,
        message: json?.message || `Upstream HTTP ${res.status}`,
        body: text,
      };
    }
    return json;
  } catch {
    // Upstream không trả JSON → trả thẳng body để FE debug
    return {
      __upstreamError: true,
      status: res.status,
      message: `Upstream not JSON (HTTP ${res.status})`,
      body: text,
    };
  }
};

export const getMatrix = async (origins, destinations) => {
  const url = `${base}/route/matrix?key=${key}&origins=${origins}&destinations=${destinations}`;
  const res = await fetch(url);
  return res.json();
};

export const getAutoSuggest = async (text, location, acronym) => {
  const url = `${base}/autosuggest?key=${key}&text=${encodeURIComponent(text)}${
    location ? `&location=${location}` : ""
  }${acronym ? `&acronym=${acronym}` : ""}`;
  const res = await fetch(url);
  return res.json();
};

export const getPlaceDetail = async (id) => {
  const url = `${base}/place/detail/${id}?key=${key}`;
  const res = await fetch(url);
  return res.json();
};

export const getTextSearch = async (text, types, datetime, location) => {
  const url = `${base}/place/text-search?key=${key}&text=${encodeURIComponent(text)}${
    types ? `&types=${types}` : ""
  }${datetime ? `&datetime=${datetime}` : ""}${location ? `&location=${location}` : ""}`;
  const res = await fetch(url);
  return res.json();
};

export const getNearbySearch = async (location, radius, text, types, tags, datetime) => {
  const url = `${base}/place/nearby-search?key=${key}&location=${location}${
    radius ? `&radius=${radius}` : ""
  }${text ? `&text=${encodeURIComponent(text)}` : ""}${types ? `&types=${types}` : ""}${
    tags ? `&tags=${tags}` : ""
  }${datetime ? `&datetime=${datetime}` : ""}`;
  const res = await fetch(url);
  return res.json();
};

export const getViewboxSearch = async (viewbox, text, types, tags, datetime) => {
  const url = `${base}/place/viewbox-search?key=${key}&viewbox=${viewbox}${
    text ? `&text=${encodeURIComponent(text)}` : ""
  }${types ? `&types=${types}` : ""}${tags ? `&tags=${tags}` : ""}${
    datetime ? `&datetime=${datetime}` : ""
  }`;
  const res = await fetch(url);
  return res.json();
};

export const getGeocodeV2 = async (address, location, viewbox) => {
  const url = `https://api.map4d.vn/sdk/v2/geocode?key=${key}${
    address ? `&address=${encodeURIComponent(address)}` : ""
  }${location ? `&location=${location}` : ""}${viewbox ? `&viewbox=${viewbox}` : ""}`;
  console.log('[Map4D:geocode] URL =', url);
  
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    console.error('[Map4D:geocode] fetch error:', e);
    return { 
      success: false, 
      message: e?.message || "Failed to fetch from Map4D" 
    };
  }
  
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      return {
        success: false,
        message: json?.message || `Map4D API returned HTTP ${res.status}`,
        status: res.status,
      };
    }
    return json;
  } catch {
    return {
      success: false,
      message: `Invalid JSON response from Map4D (HTTP ${res.status})`,
      body: text.slice(0, 200),
    };
  }
};

export const getReverseGeocode = async (location) => {
  // Map4D Places API - viewbox search to get address from coordinates
  // Using a small viewbox around the point for reverse geocoding
  const [lat, lon] = location.split(',').map(s => parseFloat(s.trim()));
  const delta = 0.001; // ~100m radius
  const viewbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  
  const url = `${base}/place/viewbox-search?key=${encodeURIComponent(key)}&viewbox=${encodeURIComponent(viewbox)}`;
  console.log("[Map4D:getReverseGeocode] URL =", url);
  console.log("[Map4D:getReverseGeocode] Location:", location, "Viewbox:", viewbox);
  
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    console.error("[Map4D:getReverseGeocode] fetch error:", e);
    return { 
      success: false, 
      code: 'fetch_error',
      message: e?.message || "Failed to fetch from Map4D" 
    };
  }

  const text = await res.text();
  console.log("[Map4D:getReverseGeocode] Response status:", res.status, "Body:", text.slice(0, 500));
  
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      return {
        success: false,
        code: json?.code || 'api_error',
        message: json?.message || `Map4D API returned HTTP ${res.status}`,
        status: res.status,
      };
    }
    
    // Transform viewbox-search response to match reverse-geocode format
    // Return the closest result
    if (json.result && json.result.length > 0) {
      const place = json.result[0];
      return {
        code: 'ok',
        result: [{
          address: place.address || '',
          name: place.name || '',
          location: place.location,
          types: place.types
        }]
      };
    }
    
    return json;
  } catch {
    return {
      success: false,
      code: 'parse_error',
      message: `Invalid JSON response from Map4D (HTTP ${res.status})`,
      body: text.slice(0, 200),
    };
  }
};
