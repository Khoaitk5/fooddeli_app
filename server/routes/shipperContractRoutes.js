const express = require("express");
const router = express.Router();
const controller = require("../controllers/shipperContractController");

router.get("/ping", (req, res) => res.send("✅ shipperContractRoutes OK"));

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
