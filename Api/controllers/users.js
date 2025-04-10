import bcrypt from "bcrypt";
import { User } from "../models/user.js";

const MILILSECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

/*soon */
export async function Signup(req, res) {
    try {
        const {  } = req.body;

        // Vérifie si l'email existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Client already exists" });
        }

        // Hashage du mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Création du nouvel utilisateur avec conversion de birthday
        const newUser = new User({
        });

        await newUser.save();
        res.status(201).json({ user: newUser });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

export async function Signin(req, res) {
    try{
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            await new Promise(resolve => setTimeout(resolve, 50));
            return res.status(400).json({
                message: "Password or email doesn't exists"
            })
        } // 200ms
        const passwordMatch = bcrypt.compareSync(password, user.password)
            if (!passwordMatch) {
                res.status(400).json({ message: "Password or email doesn't exists" })
            }
        let options = {
            maxAge: MILILSECONDS_IN_A_DAY * 14, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server CSRF
        }
        res.cookie('user', user.id, options)
        res.json({
            user: user
        })
    } catch (error){
        console.log(error)
        res.json({ message: "error in logging in client" })
    }
}