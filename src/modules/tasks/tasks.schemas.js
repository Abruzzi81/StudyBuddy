const { z } = require("zod");

const idParams = z.object({
    id: z.coerce.number().int().positive()
});

const createTasksBody = z.object({
    roomId: z.number().int().positive(),
    reservedBy: z.string().trim().min(3).max(100),
    participants: z.number().int().positive(),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),

    title: z.string().trim().min(3).max(150),
    description: z.string().trim().min(3).max(500),
    due_date: z.string().datetime({ offset: true }),
    type: z.string().trim().min(3).max(20),
    status: z.string().trim().min(3).max(20),

}).strict();

const listTaskssQuery = z.object({
    limit: z.coerce.number().int().positive().max(100).default(20),
});


module.exports = { idParams, createTasksBody, listTaskssQuery };