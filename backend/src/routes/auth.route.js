const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const protect = require("../middleware/protect")

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/cart", protect, authController.cart)
router.get("/", protect, authController.viewCart);
router.post("/placeOrder", protect, authController.makeOrder)

module.exports = router;