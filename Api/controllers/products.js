import { Product } from "../models/product.js"


export async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.json({ message: "error in getting products" })
    }
}

export async function getProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.json({ message: "error in getting product" })
    }
}

/*soon */
export async function createProduct(req, res) {
    try {
        const {  } = req.body
        const newProduct = new Product({  })
        await newProduct.save()
        res.status(200).json({ message: "Product created successfully" })
    } catch (error) {
        console.log(error)
        res.json({ message: "error in creating product" })
    }   
}

/*soon */
export async function updateProduct(req, res) {
    try {
        const {  } = req.body
        const updatedproduct = await Product.findByIdAndUpdate(req.params.id,{
        
        })
        res.status(200).json({ message: "Product updated successfully", data: updatedproduct })
    } catch (error) {
        console.log(error)
        res.json({ message: "error in updating product" })
    }
}

export async function deleteProduct(req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        console.log(error)
        res.json({ message: "error in deleting product" })
    }
}