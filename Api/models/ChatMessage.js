import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    senderType: {
        type: String,
        enum: ["Student", "Teacher"],
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 500
    }
}, { timestamps: true });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
