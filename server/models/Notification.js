import mongoose from "mongoose";

const notifySchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    notifiedDate:{
        type:Date,
        required:true
    },
    dateKey:{
        type:String,
        required:true
    }
});

notifySchema.index({ email: 1, dateKey: 1 }, { unique: true });

export default mongoose.model("Notification",notifySchema);
