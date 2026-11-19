const { z } = require("zod");

const idParams = z.object({
    id: z.coerce.number().int().positive()
});

const createSubjectBody = z.object({
    name: z.string().trim().min(2).max(100),
    teacher: z.string().trim().min(2).max(100).optional().nullable()
}).strict();

const listSubjectsQuery = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["id", "name", "teacher", "createdAt"]).default("id"),
    order: z.enum(["asc", "desc"]).default("desc")
});

const updateSubjectBody = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    teacher: z.string().trim().min(2).max(100).nullable().optional()
}).strict().refine(data => Object.keys(data).length > 0, {
    message: "Podaj przynajmniej jedno pole do aktualizacji"
});
module.exports = { idParams, createSubjectBody, updateSubjectBody, listSubjectsQuery };
