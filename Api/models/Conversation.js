import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
}, { timestamps: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);
