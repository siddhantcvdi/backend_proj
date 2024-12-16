import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4200, ()=>{
        console.log("Server Running!!!", process.env.PORT);
    })
}).catch((err)=>{
    console.log("Error in starting app", err);
    
})