import express from "express";
import {
    registerTeacher,    // ✍️ Enregistrement d'un teacher 
    loginTeacher,       // 🔑 Connexion d'un teacher
    getMyProfile,
    getTeacherClasses,
    getTeacherStats,
    logoutTeacher,       // 👤 Récupération du profil 
} from "../controllers/Teachers.js";

const router = express.Router();

router.post("/register", registerTeacher);// ✍️ 
router.post("/login", loginTeacher);// 🔑 
router.get("/me", getMyProfile);// 👤 
router.get("/classe" , getTeacherClasses) // ✅  récupérer les classes d'un enseignant 
router.get("/stats" , getTeacherStats)
router.get("/logout", logoutTeacher)

export { router as teacherRouter };