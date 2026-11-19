function createKnexUnitOfWork(db) {
    function createTasksRepository(trx) {
        return {
            async list(userId, { limit = 20, sortBy = "id", order = "desc" } = {}) {
                return trx("tasks")
                    .where({ user_id: userId })
                    .select("*")
                    .orderBy(sortBy, order)
                    .limit(limit);
            },

            async findById(id, userId) {
                const task = await trx("tasks")
                    .where({ id, user_id: userId })
                    .first();
                return task ?? null;
            },

            async create(data, userId) {
                const [task] = await trx("tasks")
                    .insert({
                        user_id: userId,
                        subject_id: data.subject_id ?? null,
                        title: data.title,
                        description: data.description ?? null,
                        due_date: data.due_date ?? null,
                        type: data.type ?? "OTHER",
                        status: data.status ?? "PENDING"
                    })
                    .returning("*");
                return task;
            },

            async cancel(id, userId) {
                const [task] = await trx("tasks")
                    .where({ id, user_id: userId })
                    .update({ status: "CANCELED" })
                    .returning("*");
                return task ?? null;
            }
        };
    }

    async function runInTransaction(work) {
        return db.transaction(async (trx) => {
            const tasksRepository = createTasksRepository(trx);
            return work({ tasksRepository, trx });
        });
    }

    return { runInTransaction };
}

module.exports = { createKnexUnitOfWork };
