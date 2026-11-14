const { NotFoundError } = require("../../errors/AppError");

function createSubjectsService({ runInTransaction }) {

    async function getAll() {
        return await runInTransaction(async ({ subjectsRepository }) => {
            return await subjectsRepository.list();
        });
    }
    
    async function getSubject(id) {
        return await runInTransaction(async ({ subjectsRepository }) => {
            const subject = await subjectsRepository.findById(id);

            if (!subject) { 
                throw new NotFoundError("Subject"); 
            }

            return subject;
        });
    }

    async function createSubject(input) {
        return await runInTransaction(async ({ subjectsRepository }) => {
            return await subjectsRepository.create(input);
        });
    }

    async function removeSubject(id) {
        return await runInTransaction(async ({ subjectsRepository }) => {
            const subject = await subjectsRepository.findById(id);

            if (!subject) { 
                throw new NotFoundError("Subject"); 
            }

            return await subjectsRepository.remove(id);
        });
    }

    return { getAll, getSubject, createSubject, removeSubject };
}

module.exports = { createSubjectsService };