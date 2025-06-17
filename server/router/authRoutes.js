const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const authController = require("../controller/authController");
router.post("/signup", upload.single("image"), authController.signup_Post);

router.post("/login", authController.login_Post);
router.post("/loginAdmin", authController.login_admine);
router.post("/logout", authController.logout_Post);
router.post("/forgetPassword", authController.Forget_Password);
router.post("/verifyResetCode", authController.verifyResetCode);
router.post("/resetPassword", authController.Reset_Password);
module.exports = router;