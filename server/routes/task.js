import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  clearTask,
} from "../controllers/task.js";

import express from "express";
import verifyJwt from "../middleware/verifyJwt.js";

const taskRouter = express.Router();

taskRouter.use(verifyJwt);

taskRouter.post("/", addTask);

taskRouter.get("/", getTask);
taskRouter.post("/list", getTask);

taskRouter.put("/:taskId", updateTask);
taskRouter.patch("/:taskId/clear", clearTask);

taskRouter.delete("/:taskId", deleteTask);

export default taskRouter;
