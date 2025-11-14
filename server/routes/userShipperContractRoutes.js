const express = require("express");
const router = express.Router();
const controller = require("../controllers/userShipperContractController");

router.get("/ping", (req, res) => res.send("✅ userShipperContractRoutes OK"));

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/user/:userId", controller.listByUser);
router.get("/:id", controller.getById);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
