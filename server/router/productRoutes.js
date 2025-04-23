const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const { requireMidllware } = require("../midllware/authMidllware");
const productController = require("../controller/productController");
router.post(
  "/create",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "multipleFiles", maxCount: 5 },
  ]),
  requireMidllware,
  productController.create_product
);
router.get("/get/:userId", requireMidllware, productController.Get_product);
router.get(
  "/getOne/:productId",
  requireMidllware,
  productController.Get_One_Product
);
router.delete(
  "/delete/:productId",
  requireMidllware,
  productController.delete_product
);
router.put(
  "/update/:productId",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "multipleFiles", maxCount: 5 },
  ]),
  requireMidllware,
  productController.Update_product
);
module.exports = router;
