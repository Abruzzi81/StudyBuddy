const { toTaskResponse } = require("./tasks.mapper");

function createTasksController(taskService) {
    return {
        async getAll(req, res) {
            const tasks = await taskService.getAll(req.user.id, req.validated.query);
            res.json(tasks.map(toTaskResponse));
        },

        async getById(req, res) {
            const task = await taskService.getTask(req.validated.params.id, req.user.id);
            res.json(toTaskResponse(task));
        },

        async create(req, res) {
            const task = await taskService.createTask(req.validated.body, req.user.id);
            res.status(201)
                .location(`/api/tasks/${task.id}`)
                .json(toTaskResponse(task));
        },

        async cancel(req, res) {
            const task = await taskService.cancelTask(req.validated.params.id, req.user.id);
            res.json(toTaskResponse(task));
        }
    };
}

module.exports = { createTasksController };
