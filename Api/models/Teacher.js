import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
}, { timestamps: true });

export const Teacher = mongoose.model("Teacher", TeacherSchema);