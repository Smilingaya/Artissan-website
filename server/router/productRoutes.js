const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const productController = require("../controller/productController");
router.post(
  "/create",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "multipleFiles", maxCount: 5 },
  ]),
  productController.create_product
);
router.get("/get/:userId", productController.Get_product);
router.get("/getOne/:productId", productController.Get_One_Product);
router.delete("/delete/:productId", productController.delete_product);
router.put(
  "/update/:productId",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "multipleFiles", maxCount: 5 },
  ]),
  productController.Update_product
);
module.exports = router;
