import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config()
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server Running!!!");
    })
})
.catch((err)=>{
    console.log("Error in starting app", err);
    
})