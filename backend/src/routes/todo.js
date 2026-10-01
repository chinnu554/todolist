import {Router} from "express";
import {createTodo,deleteTodo,getTodos,updateTodo,toggleTodoCompletion} from "../controllers/todo.js";

const router = Router();

router.post("/",createTodo);
router.get("/",getTodos);
router.put("/:todoId",updateTodo);
router.delete("/:todoId",deleteTodo);
router.patch("/:todoId/toggle",toggleTodoCompletion);

router.use((req,res)=>{
    res.status(404).json({message:"Route not found",success:false});
});

export default router;