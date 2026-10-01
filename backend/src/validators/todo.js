import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().trim().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Please provide a valid id"
})

export const createTodoSchema = z.object({
    description: z.string().trim().min(1).max(200),
})

export const updateTodoSchema = z.object({
    todoId: objectIdSchema,
    description: z.string().trim().min(1).max(200).optional()
})

export const toggleTodoSchema = z.object({
    todoId: objectIdSchema
})

export const deleteTodoSchema = z.object({
    todoId: objectIdSchema
})