import { Message } from "../models/contact.js";
import "dotenv/config";
import nodemailer from "nodemailer";

export async function createContact(req, res) {
    try {
        const { email, message } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "❌ Email invalide." });
        }

        const newMessage = new Message({ email, message });
        await newMessage.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: email,
            to: "mohamedriaddoukha@gmail.com", // school email
            subject: "📩 Nouveau message depuis la plateforme",
            text: message,
        });

        await transporter.sendMail({
            from: `"Support École - Liberty School 📚" <${process.env.USER}>`,
            to: email,
            subject: "✅ Nous avons bien reçu votre message",
            text: `Bonjour,\n\nNous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.\n\nVoici une copie de votre message :\n"${message}"\n\nMerci de nous avoir contactés !`,
        });

        res.status(201).json({ message: "✅ Message envoyé, enregistré, et confirmation envoyée." });

    } catch (error) {
        console.error("❌ Erreur dans contact us :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}