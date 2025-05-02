const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const authController = require("../controller/authController");
router.post("/signup", upload.single("image"), authController.signup_Post);
router.post("/login", authController.login_Post);
router.post("/loginAdmin", authController.login_admine);
module.exports = router;
