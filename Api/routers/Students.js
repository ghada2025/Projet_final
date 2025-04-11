import express from "express";
import { getStudent, Signin, Signup } from "../controllers/Students.js";



const router = express.Router()
router.get("/:id", getStudent);
router.post("/login", Signin);
router.post("/register", Signup);



export { router as studentRouter };