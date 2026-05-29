import {addTask,getTask,updateTask,deleteTask} from "../controllers/task.js";
import express from "express";
const taskRouter = express.Router();
taskRouter.post("/add-task",addTask);
taskRouter.post("/get-task",getTask);
taskRouter.post("/update-task",updateTask);
taskRouter.post("/delete-task",deleteTask);
export default taskRouter;