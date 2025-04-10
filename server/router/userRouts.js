const { Router } = require("express");
const { requireMidllware } = require("../midllware/authMidllware");
const router = Router();
const userController = require("../controller/userController");
router.get("/:userId", requireMidllware, userController.Get_User_Controller);
router.put("/:userId", requireMidllware, userController.Update_User_Controller);
router.post("/follow/:userId", userController.follow_Post_Controller);
router.post("/unfollow/:userId", userController.unfollow_Post_Controller);
module.exports = router;
