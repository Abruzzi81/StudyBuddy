const { NotFoundError } = require("../../errors/AppError");
function createTasksService({ runInTransaction }) {
  async function getAll(userId, query) {
    return runInTransaction(({ tasksRepository }) => tasksRepository.list(userId, query));
  }
  async function getSummary(userId) {
    return runInTransaction(({ tasksRepository }) => tasksRepository.summary(userId));
  }
  async function getTask(id, userId) {
    return runInTransaction(async ({ tasksRepository }) => {
      const task = await tasksRepository.findById(id, userId);
      if (!task) throw new NotFoundError("Task");
      return task;
    });
  }
  async function createTask(input, userId) {
    return runInTransaction(async ({ tasksRepository, trx }) => {
      if (input.subject_id != null) {
        const subject = await trx("subjects").where({ id: input.subject_id, user_id: userId }).first();
        if (!subject) throw new NotFoundError("Subject");
      }
      return tasksRepository.create(input, userId);
    });
  }
  async function updateTask(id, input, userId) {
    return runInTransaction(async ({ tasksRepository, trx }) => {
      if (input.subject_id != null) {
        const subject = await trx("subjects").where({ id: input.subject_id, user_id: userId }).first();
        if (!subject) throw new NotFoundError("Subject");
      }
      const task = await tasksRepository.update(id, input, userId);
      if (!task) throw new NotFoundError("Task");
      return task;
    });
  }
  async function cancelTask(id, userId) {
    return runInTransaction(async ({ tasksRepository }) => {
      const task = await tasksRepository.cancel(id, userId);
      if (!task) throw new NotFoundError("Task");
      return task;
    });
  }
  return { getAll, getSummary, getTask, createTask, updateTask, cancelTask };
}
module.exports = { createTasksService };
