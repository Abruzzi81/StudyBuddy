function createKnexUnitOfWork(db) {
    function createTasksRepository(trx) {
        return {
            async list({ limit = 20, sortBy = 'id', order = 'asc' } = {}) {
                return await trx('tasks')
                    .select('*')
                    .orderBy(sortBy, order)
                    .limit(limit);
            },

            async findById(id) {
                const task = await trx('tasks')
                    .where({ id })
                    .first();

                return task ?? null;
            },

            async create(data) {
                const taskData = {
                    title: data?.title,
                    description: data?.description ?? null,
                    due_date: data?.due_date ?? null,
                    type: data?.type ?? null,
                    status: data?.status ?? 'PENDING'
                };

                if (!taskData.title) {
                    throw new Error("Pole 'title' jest wymagane!");
                }

                const [task] = await trx('tasks')
                    .insert(taskData)
                    .returning('*');

                return task;
            },

            async cancel(id) {
                const [task] = await trx('tasks')
                    .where({ id })
                    .update({ status: 'CANCELED' })
                    .returning('*');

                return task ?? null;
            }
        };
    }

    // Funkcja zarządzająca transakcją, przekazywana do serwisu
    async function runInTransaction(work) {
        return await db.transaction(async (trx) => {
            const tasksRepository = createTasksRepository(trx);
            return await work({ tasksRepository });
        });
    }

    return { runInTransaction };
}

module.exports = { createKnexUnitOfWork };