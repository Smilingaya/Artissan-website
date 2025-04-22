const { Router } = require("express");
const router = Router();
const orderController = require("../controller/orderController");

router.post("/create/:id", orderController.create_order);
router.get("/user/:userId", orderController.Get_user_orders);
router.delete("/delete/:orderId", orderController.delete_order);
router.get("/artissan/:artisanId", orderController.get_user_commanded_products);
router.put("/update/:orderId", orderController.update_status);
router.get("/get/:orderId", orderController.Get_One_order);
module.exports = router;
