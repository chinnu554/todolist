import dotenv from "dotenv";
import connectDb from "./src/configs/mongoConnect.js";
import app from "./app.js";

dotenv.config();

const startServer = async()=>{
    try{
        await connectDb();

        const port = process.env.PORT || 3000;
        app.listen(port,()=>{
            console.log(`server is running on port ${port}`);
        })
    }
    catch(err){
        console.error("Unable to start server",err);
        process.exit(1);
    }
}

startServer();