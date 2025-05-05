import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: 500,
    },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);

