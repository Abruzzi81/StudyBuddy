const { NotFoundError } = require("../../errors/AppError");

function createGradesService({ runInTransaction }) {
    async function getAll(userId, query) {
        return runInTransaction(({ gradesRepository }) =>
            gradesRepository.list(userId, query)
        );
    }

    async function getAverage(userId, subjectId) {
        return runInTransaction(async ({ gradesRepository, trx }) => {
            if (subjectId) {
                const query = trx("subjects").where({
                    id: subjectId
                });

                if (userId !== null) {
                    query.where({ user_id: userId });
                }

                const subject = await query.first();

                if (!subject) {
                    throw new NotFoundError("Subject");
                }
            }
            return gradesRepository.average(userId, subjectId);
        });
    }

    async function getGrade(id, userId) {
        return runInTransaction(async ({ gradesRepository }) => {
            const grade = await gradesRepository.findById(id, userId);
            if (!grade) throw new NotFoundError("Grade");
            return grade;
        });
    }

    async function createGrade(input, userId) {
        return runInTransaction(async ({ gradesRepository, trx }) => {
            const subject = await trx("subjects")
                .where({ id: input.subject_id, user_id: userId })
                .first();

            if (!subject) throw new NotFoundError("Subject");
            return gradesRepository.create(input, userId);
        });
    }

    async function removeGrade(id, userId) {
        return runInTransaction(async ({ gradesRepository }) => {
            const grade = await gradesRepository.remove(id, userId);
            if (!grade) throw new NotFoundError("Grade");
            return grade;
        });
    }

    return { getAll, getAverage, getGrade, createGrade, removeGrade };
}

module.exports = { createGradesService };
