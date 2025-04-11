import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
}, { timestamps: true });

export  const Student = mongoose.model("Student", StudentSchema)