const { z } = require("zod");

const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];
const TASK_TYPES = ['HOMEWORK', 'TEST', 'OTHER'];

const idParams = z.object({
    id: z.coerce.number().int().positive()
});

const createTaskBody = z.object({
    subject_id: z.coerce.number().int().positive().optional().nullable(),
    title: z.string().trim().min(3).max(150),
    description: z.string().trim().min(3).max(500),
    due_date: z.string().datetime({ offset: true }),
    type: z.enum(TASK_TYPES).default('OTHER'),
    status: z.enum(TASK_STATUSES).default('PENDING')
}).strict();

const listTasksQuery = z.object({
    limit: z.coerce.number().int().positive().max(100).default(20),

    sortBy: z.enum([
        'id',
        'title',
        'due_date',
        'createdAt',
        'status',
        'type'
    ]).default('id'),

    order: z.enum(['asc', 'desc']).default('desc'),
});


module.exports = { idParams, createTaskBody, listTasksQuery, TASK_STATUSES, TASK_TYPES };