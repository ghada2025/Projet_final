import express from "express";
import { createOrder, deleteOrder, getOrders, updateOrder } from "../controllers/orders.js";
import { verifyIfAdmin } from "../middleware/verifyIfAdmin.js";


const router = express.Router();

router.get("/", verifyIfAdmin, getOrders);
router.post("/", createOrder); 
router.put("/", verifyIfAdmin, updateOrder); 
router.delete("/", verifyIfAdmin, deleteOrder);

export { router as orderRouter };