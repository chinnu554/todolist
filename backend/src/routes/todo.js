import {Router} from "express";
import {createTodo,deleteTodo,getTodos,updateTodo} from "../controllers/todo.js";

const router = Router();

router.post("/",createTodo);
router.get("/",getTodos);
router.put("/:todoId",updateTodo);
router.delete("/:todoId",deleteTodo);

export default router;