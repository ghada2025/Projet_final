import { User } from "../models/user.js";

export async function verifyIfAdmin(req, res, next) {
    const { user } = req.cookies
    const myUser = await User.findById(user)
    if (myUser.role === "admin") {
        next()
    } else {
        return res.status(401).json({ message: "Unauthorized" })
    }
}