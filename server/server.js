import express from "express"
import cors from 'cors'
import connectDb from "./configs/mongoConnect.js";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/task.js";
const app = express();
app.use(cors());
app.use(express.json());
connectDb();
app.listen(3000,()=>{
    console.log("server is running at port 3000");
})
app.get("/",(req,res)=>{
    res.send("Hello from todo list server")
})
app.use("/auth",authRouter);
app.use("/task",taskRouter);