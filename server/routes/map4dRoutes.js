import express from "express";
import * as map4dCtrl from "../controllers/map4dController.js";

const router = express.Router();

router.get("/route", map4dCtrl.routeHandler);
router.get("/matrix", map4dCtrl.matrixHandler);
router.get("/autosuggest", map4dCtrl.autosuggestHandler);
router.get("/place/detail/:id", map4dCtrl.placeDetailHandler);
router.get("/place/text-search", map4dCtrl.textSearchHandler);
router.get("/place/nearby-search", map4dCtrl.nearbySearchHandler);
router.get("/place/viewbox-search", map4dCtrl.viewboxSearchHandler);
router.get("/geocode", map4dCtrl.geocodeHandler);
router.get("/reverse-geocode", map4dCtrl.reverseGeocodeHandler);

export default router;
