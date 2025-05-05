import { Conversation } from "../models/Conversation.js";
import { Student } from "../models/Student.js";
import { Classe } from "../models/Classe.js";
import { ChatMessage } from "../models/ChatMessage.js";
import mongoose from "mongoose";

export const createConversation = async (req, res) => {
    try {
        const studentId = req.cookies.studentId;

        // 🔍 Trouver l'étudiant
        const student = await Student.findById(studentId);
        if (!student || !student.classe) {
            return res.status(404).json({ message: "Étudiant ou classe introuvable." });
        }

        // 🔍 Trouver la classe de l'étudiant
        const classe = await Classe.findById(student.classe);
        if (!classe || !classe.teacher) {
            return res.status(404).json({ message: "Classe ou professeur introuvable." });
        }

        const teacherId = classe.teacher;

        // ✅ Vérifier si la conversation existe déjà
        const existingConv = await Conversation.findOne({
            student: studentId,
            teacher: teacherId,
        });

        if (existingConv) {
            return res.status(200).json({
                message: "Conversation déjà existante.",
                conversation: existingConv,
            });
        }

        // ✅ Créer une nouvelle conversation
        const conversation = new Conversation({
        student: studentId,
        teacher: teacherId,
        });

        await conversation.save();

        res.status(201).json({
        message: "Conversation créée avec succès.",
        conversation,
        });
    } catch (err) {
        console.error("❌ Erreur dans createConversation :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;

        let senderType = null;
        let senderId = null;
    
        if (req.cookies.studentId) {
            senderType = "student";
            senderId = req.cookies.studentId;
        } else if (req.cookies.teacherId) {
            senderType = "teacher";
            senderId = req.cookies.teacherId;
        } else {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }
    
        // ✅ Vérifie que la conversation existe
        const conv = await Conversation.findById(conversationId);
        if (!conv) {
            return res.status(404).json({ message: "Conversation introuvable." });
        }
    
        // ✅ Crée le message
        const message = new ChatMessage({
            conversation: conversationId,
            senderType,
            senderId,
            content,
        });
    
        await message.save();
    
        res.status(201).json({ message: "Message envoyé.", data: message });

    } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}



export const getMessagesByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const objectId = new mongoose.Types.ObjectId(conversationId);

        const messages = await ChatMessage.find({ conversation: objectId })
        .sort({ createdAt: 1 })
        .populate("senderId", "firstName lastName");

        res.status(200).json(messages);
    } catch (err) {
        console.error("Erreur lors de la récupération des messages :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


export async function getConversationsByTeacher(req, res) {
    try {
        const teacherId = req.cookies.teacher;
        const conversations = await Conversation.find({ teacher: teacherId }).populate("student", "firstName lastName email");
        res.status(200).json(conversations);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des conversations du professeur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
