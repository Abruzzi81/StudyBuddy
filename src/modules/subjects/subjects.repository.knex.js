function createKnexUnitOfWork(db) {
    function createSubjectsRepository(trx) {
        return {
            async list(userId, {
                limit = 20,
                sortBy = 'id',
                order = 'asc'
            } = {}) {
                return await trx('subjects')
                    .where({ user_id: userId })
                    .select('*')
                    .orderBy(sortBy, order)
                    .limit(limit);
            },

            async findById(id, userId) {
                const subject = await trx('subjects')
                    .where({
                        id,
                        user_id: userId
                    })
                    .first();

                return subject ?? null;
            },

            async create(data, userId) {
                const subjectData = {
                    name: data?.name,
                    teacher: data?.teacher ?? null,
                    user_id: userId
                };

                const [subject] = await trx('subjects')
                    .insert(subjectData)
                    .returning('*');

                return subject;
            },

            async remove(id, userId) {
                const [subject] = await trx('subjects')
                    .where({
                        id,
                        user_id: userId
                    })
                    .delete()
                    .returning('*');

                return subject ?? null;
            }
        };
    }

    async function runInTransaction(work) {
        return await db.transaction(async (trx) => {
            const subjectsRepository = createSubjectsRepository(trx);
            return await work({ subjectsRepository });
        });
    }

    return { runInTransaction };
}

module.exports = { createKnexUnitOfWork };