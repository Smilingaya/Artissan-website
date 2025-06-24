const { Router } = require("express");
const router = Router();
const adminController = require("../controller/adminController");
const { requireMidllware, isAdmin } = require("../midllware/authMidllware");

router.post("/addCategory/:id", requireMidllware, adminController.add_category);
router.post(
  "/addBlackList",
  requireMidllware,
  adminController.addBlacklistedUser
);
router.post(
  "/blockUser/:userId",
  requireMidllware,
  isAdmin,
  adminController.blockUser
);
router.get("/get", requireMidllware, adminController.get_category);
router.get("/stat", requireMidllware, adminController.getPlatformStats);
router.get(
  "/get/:categoryName",
  requireMidllware,
  adminController.get_product_by_category
);

router.delete(
  "/delete",
  requireMidllware,
  adminController.deleteBlacklistedUser
);
router.get("/blacklist", requireMidllware, adminController.blackList);
router.get("/categories", adminController.countByCategory);
module.exports = router;
