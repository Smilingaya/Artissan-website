const { Router } = require("express");
const router = Router();
const adminController = require("../controller/adminController");
const { requireMidllware, isAdmin } = require("../midllware/authMidllware");

router.post("/add/:id", requireMidllware, adminController.add_category);
router.get("/get", requireMidllware, adminController.get_category);
router.get(
  "/get/:categoryName",
  requireMidllware,
  adminController.get_product_by_category
);
router.delete(
  "/delete/:id",
  requireMidllware,
  adminController.listBlacklistedUsers
);
module.exports = router;
