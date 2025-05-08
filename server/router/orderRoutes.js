const { Router } = require("express");
const router = Router();
const orderController = require("../controller/orderController");
const { requireMidllware } = require("../midllware/authMidllware");
router.post("/create/:id", requireMidllware, orderController.create_order);
router.get("/user/:userId", requireMidllware, orderController.Get_user_orders);
router.delete(
  "/delete/:orderId",
  requireMidllware,
  orderController.delete_order
);
router.get(
  "/artissan/:artisanId",
  requireMidllware,
  orderController.get_user_commanded_products
);
router.put("/update/:orderId", requireMidllware, orderController.update_status);
router.get("/get/:orderId", requireMidllware, orderController.Get_One_order);
module.exports = router;
