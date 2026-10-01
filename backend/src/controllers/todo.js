import Todo from "../models/todo.js";
import { createTodoSchema, updateTodoSchema, deleteTodoSchema, toggleTodoSchema } from "../validators/todo.js";

export const createTodo = async (req, res, next) => {
    try {
        const todoValidation = createTodoSchema.safeParse(req.body);
        if (!todoValidation.success) {
            const error = new Error(todoValidation.error.issues[0].message);
            error.statusCode = 400;
            throw error;
        }
        const userId = req.user.userId;
        const { description } = todoValidation.data;
        const newTodo = await Todo.create({ description, userId });
        res.status(201).json({ message: "Todo created successfully", success: true, todo: newTodo });
    }
    catch (err) {
        next(err);
    }
};

export const getTodos = async (req, res, next) => {
    try {
        const todos = await Todo.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, todos });
    }
    catch (err) {
        next(err);
    }
};

export const updateTodo = async (req, res, next) => {
    try {
        const validation = updateTodoSchema.safeParse({ todoId: req.params.todoId, ...req.body });
        if (!validation.success) {
            const error = new Error(validation.error.issues[0].message);
            error.statusCode = 400;
            throw error;
        }
        const { todoId, description } = validation.data;
        const updates = {};
        if (description !== undefined) updates.description = description;
        if (Object.keys(updates).length === 0) {
            const error = new Error("At least one field is required");
            error.statusCode = 400;
            throw error;
        }
        const todo = await Todo.findOneAndUpdate({ _id: todoId, userId: req.user.userId }, updates, { new: true, runValidators: true });
        if (!todo) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({ message: "Todo updated successfully", success: true, todo });
    }
    catch (err) {
        next(err);
    }
};

export const deleteTodo = async (req, res, next) => {
    try {
        const todoValidation = deleteTodoSchema.safeParse({ todoId: req.params.todoId });
        if (!todoValidation.success) {
            const error = new Error(todoValidation.error.issues[0].message);
            error.statusCode = 400;
            throw error;
        }
        const { todoId } = todoValidation.data;
        const todo = await Todo.findOneAndDelete({ _id: todoId, userId: req.user.userId });
        if (!todo) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({ message: "Todo deleted successfully", success: true });
    }
    catch (err) {
        next(err);
    }
};

export const toggleTodoCompletion = async (req, res, next) => {
    try {
        const todoValidation = toggleTodoSchema.safeParse({ todoId: req.params.todoId });
        if (!todoValidation.success) {
            const error = new Error(todoValidation.error.issues[0].message);
            error.statusCode = 400;
            throw error;
        }
        const { todoId } = todoValidation.data;
        const todo = await Todo.findOne({ _id: todoId, userId: req.user.userId });
        if (!todo) {
            const error = new Error("Todo not found");
            error.statusCode = 404;
            throw error;
        }
        todo.isCompleted = !todo.isCompleted;
        await todo.save();
        return res.status(200).json({ message: "Todo completion status toggled successfully", success: true, todo });
    }   
    catch (err) {
        next(err);
    }
};