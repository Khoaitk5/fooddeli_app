const express = require("express");
const router = express.Router();
const map4dCtrl = require("../controllers/map4dController");

router.get("/route", map4dCtrl.routeHandler);
router.get("/matrix", map4dCtrl.matrixHandler);
router.get("/autosuggest", map4dCtrl.autosuggestHandler);
router.get("/place/detail/:id", map4dCtrl.placeDetailHandler);
router.get("/place/text-search", map4dCtrl.textSearchHandler);
router.get("/place/nearby-search", map4dCtrl.nearbySearchHandler);
router.get("/place/viewbox-search", map4dCtrl.viewboxSearchHandler);
router.get("/geocode", map4dCtrl.geocodeHandler);

module.exports = router;
