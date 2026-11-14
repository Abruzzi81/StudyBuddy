const { z } = require("zod");

const idParams = z.object({
    id: z.coerce.number().int().positive()
});

const createGradeBody = z.object({
    subject_id: z.coerce.number().int().positive(),
    grade: z.coerce.number().min(1).max(6), 
    weight: z.coerce.number().positive().default(1.0),
    description: z.string().trim().max(150).optional().nullable(),
    grade_date: z.string().date().optional()
}).strict();

const listGradesQuery = z.object({
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum([
        'id',
        'subject_id',
        'grade',
        'weight',
        'grade_date',
        'createdAt'
    ]).default('id'),
    order: z.enum(['asc', 'desc']).default('asc'),
});

module.exports = { idParams, createGradeBody, listGradesQuery };