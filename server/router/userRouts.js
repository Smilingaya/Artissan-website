const { Router } = require("express");
const { requireMidllware } = require("../midllware/authMidllware");
const { upload } = require("../utils/cloudinaryConfig");
const router = Router();
const userController = require("../controller/userController");
router.get("/:userId", requireMidllware, userController.Get_User_Controller);
router.put(
  "/:userId",
  upload.single("profilePicture"),
  requireMidllware,
  userController.Update_User_Controller
);
router.post(
  "/follow/:userId",
  requireMidllware,
  userController.follow_Post_Controller
);
router.post(
  "/unfollow/:userId",
  requireMidllware,
  userController.unfollow_Post_Controller
);
router.put(
  "/updatePicture/:userId",
  upload.single("profilePicture"),
  requireMidllware,
  userController.Update_user_profile
);
router.put(
  "/updateProfile/:userId",
  requireMidllware,
  userController.Update_User_Controller
);
router.get("/:userId/contacts", requireMidllware, userController.ContactList);
router.get(
  "/:userId/followers",
  requireMidllware,
  userController.Get_User_Followers
);
router.get(
  "/:userId/followings",
  requireMidllware,
  userController.Get_User_followings
);
module.exports = router;
