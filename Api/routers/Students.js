import express from "express";
import {
    registerStudent,    // ✍️ Enregistrement d'un étudiant sans grade
    loginStudent,       // 🔑 Connexion de l'étudiant
    getMyProfile,       // 👤 Récupération du profil 
    updateStudentGrade,  // ✏️ Mise à jour du grade
    studentsWithoutClass,
    getAllStudents,
    logoutStudent
} from "../controllers/Students.js";

const router = express.Router();

router.post("/register", registerStudent);// ✍️ 
router.post("/login", loginStudent);// 🔑 
router.get("/me", getMyProfile);// 👤 
router.put("/grade/:studentId", updateStudentGrade);// ✏️ 
router.get("/", studentsWithoutClass) // ✅  récupérer les étudiants sans classe
router.get("/all" , getAllStudents)
router.get("/logout", logoutStudent)

export { router as studentRouter };



