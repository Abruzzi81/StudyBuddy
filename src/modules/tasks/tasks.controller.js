const { toTaskResponse } = require("./tasks.mapper");
function createTasksController(taskService) {
  return {
    async getAll(req, res) {
      const userId = req.user.role === "ADMIN"
        ? null
        : req.user.id;
      const result = await taskService.getAll(userId, req.validated.query);
      res.json({ data: result.data.map(toTaskResponse), pagination: result.pagination });
    },
    async getSummary(req, res) {
      const userId = req.user.role === "ADMIN"
        ? null
        : req.user.id;

      res.json(await taskService.getSummary(userId));
    },
    async getById(req, res) {
      const userId = req.user.role === "ADMIN"
        ? null
        : req.user.id;
      const task = await taskService.getTask(req.validated.params.id, userId);
      res.json(toTaskResponse(task));
    },
    async create(req, res) {
      const task = await taskService.createTask(req.validated.body, req.user.id);
      res.status(201).location(`/api/tasks/${task.id}`).json(toTaskResponse(task));
    },
    async update(req, res) {
      const task = await taskService.updateTask(req.validated.params.id, req.validated.body, req.user.id);
      res.json(toTaskResponse(task));
    },
    async cancel(req, res) {
      const task = await taskService.cancelTask(req.validated.params.id, req.user.id);
      res.json(toTaskResponse(task));
    }
  };
}
module.exports = { createTasksController };
