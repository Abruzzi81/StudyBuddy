const { z } = require("zod");
const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"];
const TASK_TYPES = ["HOMEWORK", "TEST", "OTHER"];
const idParams = z.object({ id: z.coerce.number().int().positive() });
const createTaskBody = z.object({
  subject_id: z.coerce.number().int().positive().optional().nullable(),
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(3).max(500).optional().nullable(),
  due_date: z.string().datetime({ offset: true }).optional().nullable(),
  type: z.enum(TASK_TYPES).default("OTHER"),
  status: z.enum(TASK_STATUSES).default("PENDING")
}).strict();
const updateTaskBody = z.object({
  subject_id: z.coerce.number().int().positive().nullable().optional(),
  title: z.string().trim().min(3).max(150).optional(),
  description: z.string().trim().min(3).max(500).nullable().optional(),
  due_date: z.string().datetime({ offset: true }).nullable().optional(),
  type: z.enum(TASK_TYPES).optional(),
  status: z.enum(TASK_STATUSES).optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: "Podaj przynajmniej jedno pole do aktualizacji"
});
const listTasksQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "title", "due_date", "createdAt", "status", "type"]).default("id"),
  order: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(TASK_STATUSES).optional(),
  subject_id: z.coerce.number().int().positive().optional()
});
module.exports = { idParams, createTaskBody, updateTaskBody, listTasksQuery, TASK_STATUSES, TASK_TYPES };
