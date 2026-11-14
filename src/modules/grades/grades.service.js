const { NotFoundError } = require("../../errors/AppError");

function createGradesService({ runInTransaction }) {

    async function getAll() {
        return await runInTransaction(async ({ gradesRepository }) => {
            return await gradesRepository.list();
        });
    }
    
    async function getGrade(id) {
        return await runInTransaction(async ({ gradesRepository }) => {
            const grade = await gradesRepository.findById(id);

            if (!grade) { 
                throw new NotFoundError("Grade"); 
            }

            return grade;
        });
    }

    async function createGrade(input) {
        return await runInTransaction(async ({ gradesRepository }) => {
            return await gradesRepository.create(input);
        });
    }

    async function removeGrade(id) {
        return await runInTransaction(async ({ gradesRepository }) => {
            const grade = await gradesRepository.findById(id);

            if (!grade) { 
                throw new NotFoundError("Grade"); 
            }

            return await gradesRepository.remove(id);
        });
    }

    return { getAll, getGrade, createGrade, removeGrade };
}

module.exports = { createGradesService };