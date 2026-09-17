import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.js";
import todoRoutes from "./src/routes/todo.js";
import {authenticate} from "./src/middleware/auth.js";
import limiter from "./src/middleware/rateLimit.js";
import errorHandler from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);

app.use("/api/auth",userRoutes);
app.use("/api/todos",authenticate,todoRoutes);

app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.use((req,res,next)=>{
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

app.use(errorHandler);

export default app;