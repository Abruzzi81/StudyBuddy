function createKnexUnitOfWork(db) {
    function createSubjectsRepository(trx) {
        return {
            async list({ limit = 20, sortBy = 'id', order = 'asc' } = {}) {
                return await trx('subjects')
                    .select('*')
                    .orderBy(sortBy, order)
                    .limit(limit);
            },

            async findById(id) {
                const subject = await trx('subjects')
                    .where({ id })
                    .first();

                return subject ?? null;
            },

            async create(data) {
                const subjectData = {
                    name: data?.name,
                    teacher: data?.teacher ?? null,
                    user_id: data?.user_id ?? null,
                };

                if (!subjectData.name) {
                    throw new Error("Pole 'name' jest wymagane!");
                }

                const [subject] = await trx('subjects')
                    .insert(subjectData)
                    .returning('*');

                return subject;
            },

            async remove(id) {
                const [subject] = await trx('subjects')
                    .where({ id })
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