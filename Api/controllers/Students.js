import bcrypt from "bcrypt";
import { Student } from "../models/Student.js"
import { Course } from "../models/Course.js";

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export async function getMyProfile(req, res) {
    try {
        const studentId = req.cookies.student; // 📦 On récupère l'id du cookie

        if (!studentId) {
            return res.status(401).json({ message: "Non autorisé 🚫" });
        }

        const student = await Student.findById(studentId)

        if (!student) {
            return res.status(404).json({ message: "Enseignant introuvable ❌" });
        }

        res.json({ student }); // ✅ Envoie du profil
    } catch (error) {
        console.log("❌ Erreur dans getMyProfile :", error);
        res.status(500).json({ message: "Erreur lors de la récupération du profil 🚨" });
    }
}

export async function registerStudent(req, res) {
    try {
        const { firstName, lastName, email, password, grade } = req.body;

        // 🔎 Vérifie si l'email existe déjà
        // 🔎 Vérifie si l'email existe déjà
        const StudentExists = await Student.findOne({ email });
        if (StudentExists) {
            return res.status(400).json({ message: "Email déjà utilisé 📧" });
        }

        // ❗️ Vérifie que le mot de passe est fourni
        if (!password) {
            return res.status(400).json({ message: "Mot de passe requis 🔒" });
        }

        // 🔐 Hash du mot de passe
        // 🔐 Hash du mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);


        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password: hash,
            grade
        });

        await newStudent.save();
        res.status(201).json({ student: newStudent }); // ✅ Succès

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur 💥", error: error.message });
    }
}

export async function loginStudent(req, res) {
    try {
        const { email, password } = req.body;

        // 🔎 Recherche du student
        const student = await Student.findOne({ email });

        if (!student) {
            await new Promise(resolve => setTimeout(resolve, 50)); // 💤 protection brute force
            return res.status(400).json({ message: "Email ou mot de passe invalide ❌" });
        }

        // 🔐 Vérification du mot de passe
        const passwordMatch = bcrypt.compareSync(password, student.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Email ou mot de passe invalide ❌" });
        }

        // 🍪 Création du cookie de session
        const options = {
            maxAge: MILLISECONDS_IN_A_DAY * 14, // 📅 14 jours
            httpOnly: true, // 🔒 sécurité
            path: '/',
        };
        res.cookie("student", student.id, options); // ✅ cookie envoyé
        res.json({ student }); // 🏁 Succès
        console.log("🍪 Cookie de session envoyé")


    } catch (error) {
        console.log("❌ Erreur dans loginStudent :", error);
        res.status(500).json({ message: "Erreur lors de la connexion 🔐" });
    }
}

export async function updateStudentGrade(req, res) {
    try {
        const studentId = req.params; // 📦 On récupère l'id du cookie
        const { grade } = req.body;

        // 🔎 Recherche du student
        const student = await Student.findById( studentId );

        if (!student) {
            return res.status(404).json({ message: "Etudiant introuvable ❌" });
        }
        // ✏️ Update grade
        student.grade = grade;
        await student.save();

        res.json({ student }); // ✅ Envoie du profil
    } catch (error) {
        console.log("❌ Erreur dans updateStudentGrade :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil 🚨" });
    }
}

export async function studentsWithoutClass(req, res) {
    try {
        const students = await Student.find({ 
            $or: [
                { classe: { $exists: false } }, 
                { classe: null }
            ]
        });
        const simplifiedStudents = students.map(student => ({
            id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            createdAt: student.createdAt,
            classe: student.grade
        }));

        res.json({ students: simplifiedStudents });
        
    } catch (error) {
        console.error("❌ Erreur lors de la recherche des étudiants sans classe :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

export async function getAllStudents(req, res) {
    try {
        
        const students = await Student.find({}).populate("classe");

        const simplifiedStudents = await Promise.all(
            students.map(async (student) => {
                let totalCourses = 0;

                // Si l'étudiant a une classe, chercher les cours liés à cette classe
                if (student.classe) {
                    totalCourses = await Course.countDocuments({ classe: student.classe._id });
                }

                // Nombre de cours terminés
                const completedCourses = student.completedCourses.length;

                // Calcul du pourcentage de progression
                let progress = 0;
                if (totalCourses > 0) {
                    progress = Math.round((completedCourses / totalCourses) * 100);
                }

                // Retourner seulement ce qui est nécessaire
                return {
                    id: student._id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email,
                    createdAt: student.createdAt,
                    classe: student.classe ? student.classe.name : "NoC",
                    progress: progress 
                };
            })
        );

        res.json({ students: simplifiedStudents });

    } catch (error) {
        console.error("❌ Erreur lors de la recherche des étudiants :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

export async function logoutStudent(req, res) {
    try {
        res.clearCookie('student')
        res.json({ message: "Logged out" })
    } catch (error) {
        console.log(error)
        res.json({ message: "error in logout controller" })
    }
}
