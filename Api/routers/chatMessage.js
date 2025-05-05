import express from "express";
import {
    createConversation,
    sendMessage,
    getMessagesByConversation,
    getConversationsByTeacher
} from "../controllers/chatMessage.js";

const router = express.Router();

// ✅ Créer une conversation (uniquement par un étudiant)
router.post("/conversation", createConversation);

// ✅ Envoyer un message
router.post("/message", sendMessage);

// ✅ Récupérer tous les messages d'une conversation
router.get("/messages/:conversationId", getMessagesByConversation);

// ✅ Récupérer tous les conversations d'un teacher
router.get("/conversations/teacher", getConversationsByTeacher);

export { router as chatRouter };
