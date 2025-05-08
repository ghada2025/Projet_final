import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/connect-db.js";
import cookieParser from "cookie-parser";
import { teacherRouter } from "./routers/Teachers.js";
import { studentRouter } from "./routers/Students.js";
import { classRouter } from "./routers/Classes.js";
import { courseRouter } from "./routers/Courses.js";
import { eventRouter } from "./routers/Events.js";
import { quizRouter } from "./routers/Quizs.js";
import { assignmentRouter } from "./routers/Assignments.js";
import { contactRouter } from "./routers/contacts.js";
import { chatRouter } from "./routers/chatMessage.js";
// socket.io 
import http from "http";
import { Server } from "socket.io";
import { Conversation } from "./models/Conversation.js";
import { ChatMessage } from "./models/ChatMessage.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://liberty-school-ghadas-projects-8123699c.vercel.app",
        credentials: true,
    }
});






// 🔗 Connexion à la base de données
connectDB();

// 🛡️ Middleware de sécurité
app.use(helmet());

// ✅ Middleware CORS
app.use(cors(
    {
        origin: "https://liberty-school-ghadas-projects-8123699c.vercel.app",
        credentials: true,
    }
));

// 📦 Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// 📌 Routes
app.use("/class", classRouter);
app.use("/course", courseRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/event", eventRouter);
app.use("/quiz", quizRouter);
app.use("/assignment", assignmentRouter);
app.use("/contact", contactRouter);
app.use("/chat", chatRouter);

// 🏓 Route de test pour vérifier si le serveur fonctionne
app.get("/ping", (req, res) => {
    res.send("pong");
});

io.on("connection", (socket) => {
    console.log("🟢 Socket connecté :", socket.id);

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
    });

    socket.on("send_message", async ({ conversation, content, senderType, senderId }) => {
        try {
            
            const conv = await Conversation.findById(conversation);
            if (!conv) {
                return socket.emit("error_message", { message: "Conversation introuvable." });
            }
            const newMessage = new ChatMessage({
                conversation,
                senderType, 
                senderId,
                content
            });
            await newMessage.save();
    
            io.to(conversation).emit("receiveMessage", newMessage);
    
        } catch (err) {
            console.error("Erreur lors de l'enregistrement du message :", err);
            socket.emit("error_message", { message: "Erreur serveur." });
        }
    });
    

    socket.on("disconnect", () => {
        console.log("🔴 Socket déconnecté :", socket.id);
    });
});

// 🚀 Démarrage du serveur
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
