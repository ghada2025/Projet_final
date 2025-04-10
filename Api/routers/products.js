import express from "express";
import { createProduct, deleteProduct,  getProduct, getProducts, updateProduct } from "../controllers/products.js";
import { verifyIfAdmin } from "../middleware/verifyIfAdmin.js";


const router = express.Router()
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", verifyIfAdmin, createProduct);
router.put("/:id", verifyIfAdmin, updateProduct); 
router.delete("/:id", verifyIfAdmin, deleteProduct); 


export { router as productRouter };