function createKnexUnitOfWork(db) {
    function createSubjectsRepository(trx) {
        return {
            async list(userId, { page = 1, limit = 20, sortBy = 'id', order = 'asc' } = {}) {
                const query = trx("subjects");

                if (userId !== null) {
                    query.where({ user_id: userId });
                }
                const countRow = await query.clone().count({ total: '*' }).first();
                const total = Number(countRow.total);
                const data = await query.clone().select('*').orderBy(sortBy === "createdAt" ? "created_at" : sortBy, order)
                    .limit(limit).offset((page - 1) * limit);
                return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
            },

            async findById(id, userId) {
                const query = trx("subjects").where({ id });

                if (userId !== null) {
                    query.where({ user_id: userId });
                }

                return (await query.first()) ?? null;
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

            async update(id, data, userId) {
                const [subject] = await trx('subjects')
                    .where({ id, user_id: userId })
                    .update(data)
                    .returning('*');
                return subject ?? null;
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