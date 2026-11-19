const { NotFoundError } = require("../../errors/AppError");

function createSubjectsService({ runInTransaction }) {
    async function getAll(userId, query) {
        return runInTransaction(({ subjectsRepository }) =>
            subjectsRepository.list(userId, query)
        );
    }

    async function getSubject(id, userId) {
        return runInTransaction(async ({ subjectsRepository }) => {
            const subject = await subjectsRepository.findById(id, userId);
            if (!subject) throw new NotFoundError("Subject");
            return subject;
        });
    }

    async function createSubject(input, userId) {
        return runInTransaction(({ subjectsRepository }) =>
            subjectsRepository.create(input, userId)
        );
    }

    async function updateSubject(id, input, userId) {
        return runInTransaction(async ({ subjectsRepository }) => {
            const subject = await subjectsRepository.update(id, input, userId);
            if (!subject) throw new NotFoundError("Subject");
            return subject;
        });
    }

    async function removeSubject(id, userId) {
        return runInTransaction(async ({ subjectsRepository }) => {
            const subject = await subjectsRepository.remove(id, userId);
            if (!subject) throw new NotFoundError("Subject");
            return subject;
        });
    }

    return { getAll, getSubject, createSubject, updateSubject, removeSubject };
}

module.exports = { createSubjectsService };
