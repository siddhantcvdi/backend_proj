import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config()
connectDB();

// ;(async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (err)=>{
//             console.log('err');
//             throw err;
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log('App Listening on port', process.env.PORT);
            
//         })
//     }catch(err){
//         console.log("ERROR: ",err);
//         throw err;
//     }
// })()