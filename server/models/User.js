import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
})
export default mongoose.model("User",userSchema);