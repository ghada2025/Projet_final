import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/connect-db.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routers/users.js";
import { productRouter } from "./routers/products.js";
import { orderRouter } from "./routers/orders.js";

const app = express();

// 🔗 Connexion à la base de données
connectDB();

// 🛡️ Middleware de sécurité
app.use(helmet());

// ✅ Middleware CORS
app.use(cors(
    {
        origin: "http://localhost:3001",
        credentials: true,
        optionsSuccessStatus: 200,
    }
));

// 📦 Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// 📌 Routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

// 🏓 Route de test pour vérifier si le serveur fonctionne
app.get("/ping", (req, res) => {
    res.send("pong");
});

// 🚀 Démarrage du serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
