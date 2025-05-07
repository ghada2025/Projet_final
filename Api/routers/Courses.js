import express from "express";
import {
  getCoursesThisWeek,          // 📅 
  getWeeklyCoursesBySubject, // 📘 
  createCourse,                // ➕ 
  updateCourse,                // ✏️ 
  deleteCourse,                 // ❌ 
  getOneCourse,
  getCoursesByTeacher,
  getCoursesByQuiz
} from "../controllers/Courses.js";

const router = express.Router();

// 📅 Tous les cours de cette semaine (pour une classe)
router.get("/week", getCoursesThisWeek);

// 👀 Voir tous les cours d’un enseignant qu'il a un quiz
router.get("/", getCoursesByTeacher);

// 👀 Voir tous les cours d’un enseignant qu'il n' a  pas un quiz
router.get("/quiz", getCoursesByQuiz);

// 📘 Tous les cours de cette semaine avec un sujet spécifique
router.get("/weekSubject/:id", getWeeklyCoursesBySubject);

// 👀 Voir un seul cours
router.get("/:id", getOneCourse);


// ➕ Créer un nouveau cours
router.post("/", createCourse);

// ✏️ Modifier un cours
router.put("/:id", updateCourse);

// ❌ Supprimer un cours
router.delete("/:id", deleteCourse);

export { router as courseRouter };
