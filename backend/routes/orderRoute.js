import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, userOrders, listOrders, updateStatus, getOrdersByShop, getOrderById } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/status", updateStatus);
orderRouter.get("/shop/:shopId/orders", getOrdersByShop);
orderRouter.get("/:orderId", getOrderById);

export default orderRouter