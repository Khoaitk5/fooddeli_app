const map4dService = require("../services/map4dService");

exports.routeHandler = async (req, res) => {
  const { origin, destination } = req.query;
  const data = await map4dService.getRoute(origin, destination);
  res.json(data);
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
