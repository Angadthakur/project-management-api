const { z } = require("zod");

const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Project name must be at least 2 characters")
        .max(100, "Project name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
});

const updateProjectSchema = z.object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .optional(),

        description: z
            .string()
            .trim()
            .max(500)
            .optional(),

        status: z
            .enum(["active", "completed", "archived"])
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        }
    );

const addMemberSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    role: z
        .enum(["manager", "member"])
        .default("member"),
});    

module.exports = {
    createProjectSchema,
    updateProjectSchema,
    addMemberSchema,
};