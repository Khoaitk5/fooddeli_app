const express = require("express");
const router = express.Router();
const controller = require("../controllers/userShopContractController");

router.get("/ping", (req, res) => res.send("✅ userShopContractRoutes OK"));

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/user/:userId", controller.listByUser);
router.get("/:id", controller.getById);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
