import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    try {
        const url = process.env.MONGO_URL;
        if (!url) {
            throw new Error("Url is missing for mongodb ");
        }
        await mongoose.connect(url);
        console.log("Mongodb is connected successfully");

    }
    catch (err) {
        console.log(err);
        throw new Error("Mongodb connection failed");
    }
}

export default connectDb;