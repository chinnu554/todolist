import express from "express"
import cors from 'cors'
import connectDb from "./configs/mongoConnect.js";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/task.js";
import otpRouter from "./routes/otp.js";
import { scheduleWeeklyNotifications } from "./controllers/notification.js";
const app = express();
app.use(cors());
app.use(express.json());
await connectDb();
scheduleWeeklyNotifications();
app.listen(3000,()=>{
    console.log("server is running at port 3000");
})
app.get("/",(req,res)=>{
    res.send("Hello from todo list server")
})
app.use("/auth",authRouter);
app.use("/task",taskRouter);
app.use("/otp",otpRouter);
