import express from "express";
import {
    createConversation,
    sendMessage,
    getMessagesByConversation,
    getConversationsByTeacher,
    getConversationsByStudent
} from "../controllers/chatMessage.js";

const router = express.Router();

// ✅ Créer une conversation (uniquement par un étudiant)
router.get("/conversation", createConversation);

// ✅ Envoyer un message
router.post("/message", sendMessage);

// ✅ Récupérer tous les messages d'une conversation
router.get("/messages/:conversationId", getMessagesByConversation);

// ✅ Récupérer tous les conversations d'un teacher
router.get("/conversations/teacher", getConversationsByTeacher);

// ✅ Récupérer tous les conversations d'un student
router.get("/conversations/student", getConversationsByStudent);

export { router as chatRouter };
