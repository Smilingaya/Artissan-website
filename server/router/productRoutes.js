const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const productController = require("../controller/productController");
router.post(
  "/create",
  upload.array("media", 4),
  productController.create_product
);
module.exports = router;
