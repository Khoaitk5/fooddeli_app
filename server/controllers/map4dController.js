const map4dService = require("../services/map4dService");

exports.routeHandler = async (req, res) => {
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

exports.matrixHandler = async (req, res) => {
  const { origins, destinations } = req.query;
  const data = await map4dService.getMatrix(origins, destinations);
  res.json(data);
};

exports.autosuggestHandler = async (req, res) => {
  const { text, location, acronym } = req.query;
  const data = await map4dService.getAutoSuggest(text, location, acronym);
  res.json(data);
};

exports.placeDetailHandler = async (req, res) => {
  const { id } = req.params;
  const data = await map4dService.getPlaceDetail(id);
  res.json(data);
};

exports.textSearchHandler = async (req, res) => {
  const { text, types, datetime, location } = req.query;
  const data = await map4dService.getTextSearch(text, types, datetime, location);
  res.json(data);
};

exports.nearbySearchHandler = async (req, res) => {
  const { location, radius, text, types, tags, datetime } = req.query;
  const data = await map4dService.getNearbySearch(location, radius, text, types, tags, datetime);
  res.json(data);
};

exports.viewboxSearchHandler = async (req, res) => {
  const { viewbox, text, types, tags, datetime } = req.query;
  const data = await map4dService.getViewboxSearch(viewbox, text, types, tags, datetime);
  res.json(data);
};

exports.geocodeHandler = async (req, res) => {
  const { address, location, viewbox } = req.query;
  const data = await map4dService.getGeocodeV2(address, location, viewbox);
  res.json(data);
};
