import express from "express";
import User from "../models/newUser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router()

router.post("/register", async (req,res) =>{
    const user = req.body
    try{

        const existingUser = await User.findOne({email: user.email})
        if (existingUser) {
            return res.sendStatus(409);
        }        

        const hashedPassword = await bcrypt.hash(user.password, 10)
        user.password = hashedPassword
        const newUser = await User.create(user).then(resp =>{
            console.log("saved", resp)
        })
        assignToken(user, res)

        res.send("saved success")

    }catch (error) {
        res.send(error)

    }
})

router.post("/login", async (req, res) => {

    const credentials = req.body

    const user = await User.findOne({ email: credentials.email })
    console.log(user)

    if (!user) return res.sendStatus(403)

    const similar = bcrypt.compare(credentials.password, user.password)
    console.log(similar)

    if (!similar) return res.sendStatus(403)

    assignToken(user.toJSON(), res)

    res.send("user is logged in...")

})

router.get("/is-logged-in", (req, res) => {
    const token = req.cookies?.token

    if (!token) return res.send(false)

    jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (err) => {
        if (err) res.send(false)
        else res.send(true)
    })
})

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: 'None',  
        secure: process.env.NODE_ENV === 'production' // ב-production להשתמש ב-Secure
    });
    res.status(200).send("User logged out successfully");
});

    
    function assignToken(user, res) {
        delete user.password
    
        const token = jwt.sign(user, process.env.PRIVATE_ACCESS_KEY)
    
        res.cookie("token", token, {
            httpOnly: true,
            secure: true
        })
}

export default router