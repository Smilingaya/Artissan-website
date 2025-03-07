const { Router } = require("express");
const router = Router();
const authController = require("../controller/authController");
router.post("/signup", authController.signup_Post);
router.post("/login", authController.login_Post);
module.exports = router;
