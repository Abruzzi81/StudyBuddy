function createKnexUnitOfWork(db) {
    function createGradesRepository(trx) {
        return {
            async list(userId, { page = 1, limit = 20, sortBy = "id", order = "asc", subject_id } = {}) {
                const query = trx("grades");

                if (userId !== null) {
                    query.where({ user_id: userId });
                }

                if (subject_id) {
                    query.where({ subject_id });
                }
                const countRow = await query.clone().count({ total: "*" }).first();
                const total = Number(countRow.total);
                const data = await query.clone().select("*").orderBy(sortBy === "createdAt" ? "created_at" : sortBy, order)
                    .limit(limit).offset((page - 1) * limit);
                return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
            },

            async average(userId, subjectId) {
                const query = trx("grades");

                if (userId !== null) {
                    query.where({ user_id: userId });
                }

                if (subjectId) {
                    query.where({ subject_id: subjectId });
                }

                const result = await query
                    .select(
                        trx.raw(
                            "COALESCE(SUM(grade * weight) / NULLIF(SUM(weight), 0), 0) AS average"
                        )
                    )
                    .count({ count: "*" })
                    .first();

                return {
                    average: Number(result.average),
                    count: Number(result.count)
                };
            },

            async findById(id, userId) {
                const query = trx("grades").where({ id });

                if (userId !== null) {
                    query.where({ user_id: userId });
                }

                return (await query.first()) ?? null;
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
