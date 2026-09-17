import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().trim().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Please provide a valid id"
})

export const createTodoSchema = z.object({
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(5).max(200),
})

export const updateTodoSchema = z.object({
    todoId: objectIdSchema,
    title: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().min(5).max(200).optional()
})

export const deleteTodoSchema = z.object({
    todoId: objectIdSchema
})