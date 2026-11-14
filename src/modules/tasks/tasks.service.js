const { NotFoundError } = require("../../errors/AppError");

function createTasksService({ runInTransaction }) {

    async function getAll() {
        return await runInTransaction(async ({ tasksRepository }) => {
            return await tasksRepository.list();
        });
    }
    
    async function getTask(id) {
        return await runInTransaction(async ({ tasksRepository }) => {
            const task = await tasksRepository.findById(id);

            if (!task) { 
                throw new NotFoundError("Task"); 
            }

            return task;
        });
    }

    async function createTask(input) {
        return await runInTransaction(async ({ tasksRepository }) => {
            return await tasksRepository.create(input);
        });
    }

    async function cancelTask(id) {
        return await runInTransaction(async ({ tasksRepository }) => {
            const task = await tasksRepository.findById(id);

            if (!task) { 
                throw new NotFoundError("Task"); 
            }

            return await tasksRepository.cancel(id);
        });
    }

    return { getAll, getTask, createTask, cancelTask };
}

module.exports = { createTasksService };