import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()
async function connectDb(){
    try{
        await mongoose.connect(
            process.env.MONGO_URL
        );
        console.log("Mongodb connection is successfull");
    }
    catch(err){
        console.log("Error occured in connection of database",err)
    }
}
export default connectDb;