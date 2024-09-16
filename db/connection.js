import mongoose from "mongoose";


import dotenv from "dotenv"

dotenv.config()




mongoose.connect(process.env.MONGODB_URI).then((res) => {
    console.log("connection");
}, (e) =>{
    console.log("error", e.massege)
})
