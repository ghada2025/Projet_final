import bcrypt from "bcrypt";
import { Teacher } from "../models/Teacher.js";

const MILILSECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export async function getTeacher(req, res) {
    try {
        const teacher = await Teacher.findById(req.params.id)
        res.status(200).json(teacher)
    } catch (error) {
        console.log(error)
        res.json({ message: "error in getting product" })
    }
}


export async function Signup(req, res) {
    try {
        const {  firstName, lastName, email, password } = req.body;

        // Vérifie si l'email existe déjà
        const TeacherExists = await Teacher.findOne({ email });
        if (TeacherExists) {
            return res.status(400).json({ message: "Client already exists" });
        }

        // Hashage du mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newTeacher = new Teacher({
            firstName,
            lastName,
            email,
            password: hash
        });

        await newTeacher.save();
        res.status(201).json({ Teacher: newTeacher });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

export async function Signin(req, res) {
    try{
        const { email, password } = req.body
        const teacher = await Teacher.findOne({ email })
        if (!teacher) {
            await new Promise(resolve => setTimeout(resolve, 50));
            return res.status(400).json({
                message: "Password or email doesn't exists"
            })
        } // 200ms
        const passwordMatch = bcrypt.compareSync(password, teacher.password)
            if (!passwordMatch) {
                res.status(400).json({ message: "Password or email doesn't exists" })
            }
        let options = {
            maxAge: MILILSECONDS_IN_A_DAY * 14, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server CSRF
        }
        res.cookie('teacher', teacher.id, options)
        res.json({
            teacher: teacher
        })
    } catch (error){
        console.log(error)
        res.json({ message: "error in logging in client" })
    }
}