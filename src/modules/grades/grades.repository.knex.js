function createKnexUnitOfWork(db) {
    function createGradesRepository(trx) {
        return {
            async list(userId, { limit = 20, sortBy = "id", order = "asc" } = {}) {
                return trx("grades")
                    .where({ user_id: userId })
                    .select("*")
                    .orderBy(sortBy, order)
                    .limit(limit);
            },

            async findById(id, userId) {
                const grade = await trx("grades")
                    .where({ id, user_id: userId })
                    .first();
                return grade ?? null;
            },

            async create(data, userId) {
                const [grade] = await trx("grades")
                    .insert({
                        user_id: userId,
                        subject_id: data.subject_id,
                        grade: data.grade,
                        weight: data.weight ?? 1.0,
                        description: data.description ?? null,
                        grade_date: data.grade_date ?? new Date()
                    })
                    .returning("*");
                return grade;
            },

            async remove(id, userId) {
                const [grade] = await trx("grades")
                    .where({ id, user_id: userId })
                    .delete()
                    .returning("*");
                return grade ?? null;
            }
        };
    }

    async function runInTransaction(work) {
        return db.transaction(async (trx) => {
            const gradesRepository = createGradesRepository(trx);
            return work({ gradesRepository, trx });
        });
    }

    return { runInTransaction };
}

module.exports = { createKnexUnitOfWork };
