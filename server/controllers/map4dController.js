import * as map4dService from "../services/map4dService.js";

export const routeHandler = async (req, res) => {
  try {
    const { origin, destination, mode } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: "Missing origin/destination. Expect 'lat,lon'.",
      });
    }

    // OPTIONAL: chuẩn hoá / validate đơn giản (ngăn 'undefined,undefined')
    const isPair = (s) => typeof s === 'string' && /^\s*-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?\s*$/.test(s);
    if (!isPair(origin) || !isPair(destination)) {
      return res.status(400).json({
        success: false,
        message: "Invalid origin/destination format. Use 'lat,lon'.",
      });
    }

    const data = await map4dService.getRoute(origin.trim(), destination.trim(), mode);
    // Nếu upstream gán statusCode tuỳ biến bên service, phản hồi theo
    if (data && data.__upstreamError) {
      return res.status(data.status || 500).json({
        success: false,
        message: data.message || "Map4D upstream error",
        upstream: data.body?.slice?.(0, 200),
      });
    }

    return res.json(data);
  } catch (e) {
    console.error("[routeHandler] error:", e);
    return res.status(500).json({ success: false, message: e?.message || "Map4D route error" });
  }
};

export const matrixHandler = async (req, res) => {
  const { origins, destinations } = req.query;
  const data = await map4dService.getMatrix(origins, destinations);
  res.json(data);
};

export const autosuggestHandler = async (req, res) => {
  const { text, location, acronym } = req.query;
  const data = await map4dService.getAutoSuggest(text, location, acronym);
  res.json(data);
};

export const placeDetailHandler = async (req, res) => {
  const { id } = req.params;
  const data = await map4dService.getPlaceDetail(id);
  res.json(data);
};

export const textSearchHandler = async (req, res) => {
  const { text, types, datetime, location } = req.query;
  const data = await map4dService.getTextSearch(text, types, datetime, location);
  res.json(data);
};

export const nearbySearchHandler = async (req, res) => {
  const { location, radius, text, types, tags, datetime } = req.query;
  const data = await map4dService.getNearbySearch(location, radius, text, types, tags, datetime);
  res.json(data);
};

export const viewboxSearchHandler = async (req, res) => {
  const { viewbox, text, types, tags, datetime } = req.query;
  const data = await map4dService.getViewboxSearch(viewbox, text, types, tags, datetime);
  res.json(data);
};

export const geocodeHandler = async (req, res) => {
  try {
    const { address, location, viewbox } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Missing address parameter"
      });
    }
    
    console.log('[Map4D:geocode] Request address:', address);
    const data = await map4dService.getGeocodeV2(address, location, viewbox);
    console.log('[Map4D:geocode] Response:', JSON.stringify(data).slice(0, 200));
    
    res.json(data);
  } catch (error) {
    console.error('[Map4D:geocode] Error:', error);
    res.status(500).json({ success: false, message: error?.message || 'Geocode error' });
  }
};

export const reverseGeocodeHandler = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Missing location parameter. Expected format: 'lat,lon'",
      });
    }
    const data = await map4dService.getReverseGeocode(location);
    res.json(data);
  } catch (error) {
    console.error("[reverseGeocodeHandler] error:", error);
    res.status(500).json({ success: false, message: error?.message || "Reverse geocode error" });
  }
};
