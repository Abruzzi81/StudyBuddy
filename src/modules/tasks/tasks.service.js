const { NotFoundError, ConflictError, ValidationError } = require("../../errors/AppError");

function createTasksService({tasksRepository, roomsRepository}) {

    async function getAll() {
        const tasks = await tasksRepository.list();
        return tasks;
    }
    
    async function getTask(id) {
        const task = await tasksRepository.findById(id);

        if(!task) { throw new NotFoundError("Tasks")};

        return task;
    }

    async function createTask(input) {

        return tasksRepository.create(input);
    }

    async function cancelTask(id) {
        const task = await tasksRepository.findById(id);

        if(!task) 
            throw new NotFoundError("Tasks");

        return tasksRepository.cancel(id);
    }

    return { getAll, getTask, createTask, cancelTask };
}

module.exports = { createTasksService };