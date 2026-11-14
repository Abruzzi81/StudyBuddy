function createKnexUnitOfWork(db) {
    function createGradesRepository(trx) {
        return {
            async list({ limit = 20, sortBy = 'id', order = 'asc' } = {}) {
                return await trx('grades')
                    .select('*')
                    .orderBy(sortBy, order)
                    .limit(limit);
            },

            async findById(id) {
                const grade = await trx('grades')
                    .where({ id })
                    .first();

                return grade ?? null;
            },

            async create(data) {
                const gradeData = {
                    subject_id: data?.subject_id,
                    grade: data?.grade,
                    weight: data?.weight ?? 1.0,
                    description: data?.description ?? null,
                    grade_date: data?.grade_date ?? new Date()
                };

                if (!gradeData.subject_id || !gradeData.grade) {
                    throw new Error("Pola 'subject_id' oraz 'grade' są wymagane!");
                }

                const [grade] = await trx('grades')
                    .insert(gradeData)
                    .returning('*');

                return grade;
            },

            async remove(id) {
                const [grade] = await trx('grades')
                    .where({ id })
                    .delete()
                    .returning('*');

                return grade ?? null;
            }
        };
    }

    async function runInTransaction(work) {
        return await db.transaction(async (trx) => {
            const gradesRepository = createGradesRepository(trx);
            return await work({ gradesRepository });
        });
    }

    return { runInTransaction };
}

module.exports = { createKnexUnitOfWork };