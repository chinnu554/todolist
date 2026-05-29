import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    task:{
        type:String,
        required:true,
        trim:true,
    },
    cleared:{
        type:Boolean,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried:true
    }
},{
    timestamps:true,
});
export default mongoose.model("Task",taskSchema);