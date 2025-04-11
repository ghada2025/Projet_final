import bcrypt from "bcrypt";
import { Student } from "../models/Student.js"

const MILILSECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;


export async function getStudent(req, res) {
    try {
        const student = await Student.findById(req.params.id)
        res.status(200).json(student)
    } catch (error) {
        console.log(error)
        res.json({ message: "error in getting product" })
    }
}


export async function Signup(req, res) {
    try {
        const {  firstName, lastName, email, password } = req.body;

        // Vérifie si l'email existe déjà
        const StudentExists = await Student.findOne({ email });
        if (StudentExists) {
            return res.status(400).json({ message: "Client already exists" });
        }

        // Hashage du mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password: hash
        });

        await newStudent.save();
        res.status(201).json({ user: newStudent });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

export async function Signin(req, res) {
    try{
        const { email, password } = req.body
        const student = await Student.findOne({ email })
        if (!student) {
            await new Promise(resolve => setTimeout(resolve, 50));
            return res.status(400).json({
                message: "Password or email doesn't exists"
            })
        } // 200ms
        const passwordMatch = bcrypt.compareSync(password, student.password)
            if (!passwordMatch) {
                res.status(400).json({ message: "Password or email doesn't exists" })
            }
        let options = {
            maxAge: MILILSECONDS_IN_A_DAY * 14, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server CSRF
        }
        res.cookie('student', student.id, options)
        res.json({
            student: student
        })
    } catch (error){
        console.log(error)
        res.json({ message: "error in logging in client" })
    }
}