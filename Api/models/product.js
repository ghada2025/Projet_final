import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    
}, { timestamps: true });

export  const Product = mongoose.model("Product", ProductSchema)