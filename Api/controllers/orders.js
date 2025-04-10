import {Order} from "../models/order.js"
import {User} from "../models/user.js"

export async function getOrders(req, res) {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.json({ message: "error in getting orders" })
    }
}
/*soon */
export async function createOrder(req, res) {
    try {
        const { } = req.body
        const order = new Order({  })
        const user = await User.find({ email })
        if(user){
            user.orders.push(order._id)
            await user.save()            
        }        
        await order.save()
        res.status(200).json(order)
    } catch (error) {
        console.log(error)
        res.json({ message: "error in confirming order" })
    }
}

export async function  updateOrder(req, res) {
    try {
        const {id} = req.params
        const {status} = req.body
        const order = await Order.findById(id)
        order.status = status
        await order.save()
        res.status(200).json(order)
    } catch (error) {
        console.log(error)
        res.json({ message: "error in confirming order" })
    }
}

export async function deleteOrder(req, res) {
    try {
        const {id} = req.params
        await Order.findByIdAndDelete(id)
        res.status(200).json({ message: "order deleted successfully" })
    } catch (error) {
        console.log(error)
        res.json({ message: "error in deleting order" })    
    }
}


