import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  clearTask,
} from "../controllers/task.js";

import express from "express";

const taskRouter = express.Router();

taskRouter.post("/", addTask);

taskRouter.get("/", getTask);
taskRouter.post("/list", getTask);

taskRouter.put("/:taskId", updateTask);
taskRouter.patch("/:taskId/clear", clearTask);

taskRouter.delete("/:taskId", deleteTask);

export default taskRouter;
