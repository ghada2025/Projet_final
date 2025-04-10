import express from "express";
import { Signin, Signup } from "../controllers/users.js";


const router = express.Router();
router.post("/signin", Signin);
router.post("/signup", Signup);

export { router as userRouter };