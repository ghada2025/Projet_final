import express from "express";


const router = express.Router();
router.post("/signin", Signin);
router.post("/signup", Signup);

export { router as userRouter };