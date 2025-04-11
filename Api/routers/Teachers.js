import express from "express";
import { getTeacher, Signin, Signup } from "../controllers/Teachers.js";


const router = express.Router();
router.get("/:id", getTeacher);
router.post("/login", Signin);
router.post("/register", Signup);

export { router as teacherRouter };