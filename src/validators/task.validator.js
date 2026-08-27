const { z } = require("zod");

const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Task title must be at least 2 characters")
        .max(200, "Task title cannot exceed 200 characters"),

    description: z
        .string()
        .trim()
        .max(2000, "Description cannot exceed 2000 characters")
        .optional(),

    assignedTo: z
        .string()
        .optional(),

    status: z
        .enum(["todo", "in-progress", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional(),

    dueDate: z
        .string()
        .optional(),
});

const updateTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2)
        .max(200)
        .optional(),

    description: z
        .string()
        .trim()
        .max(2000)
        .optional(),

    status: z
        .enum(["todo", "in-progress", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional(),

    dueDate: z
        .string()
        .optional(),
});

const assignTaskSchema = z.object({
    userId: z
        .string()
        .min(1)
        .nullable(),
});

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    assignTaskSchema,
};