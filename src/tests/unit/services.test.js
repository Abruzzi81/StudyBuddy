const test = require("node:test");
const assert = require("node:assert/strict");
const { createTasksService } = require("../../modules/tasks/tasks.service");
const { createGradesService } = require("../../modules/grades/grades.service");
const { NotFoundError } = require("../../errors/AppError");

function subjectTrx(subject) {
    return () => ({
        where() { return this; },
        async first() { return subject; }
    });
}

test("tasks.getAll forwards user id and filters to repository", async () => {
    const expected = { data: [{ id: 1 }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } };
    let received;
    const service = createTasksService({
        runInTransaction: work => work({ tasksRepository: { list: async (...args) => { received = args; return expected; } } })
    });
    const query = { page: 1, limit: 10, status: "PENDING" };
    assert.deepEqual(await service.getAll(7, query), expected);
    assert.deepEqual(received, [7, query]);
});

test("tasks.getTask throws NotFoundError when task does not exist", async () => {
    const service = createTasksService({
        runInTransaction: work => work({ tasksRepository: { findById: async () => null } })
    });
    await assert.rejects(service.getTask(999, 7), NotFoundError);
});

test("tasks.createTask creates a task when its subject belongs to the user", async () => {
    let created;
    const service = createTasksService({
        runInTransaction: work => work({
            tasksRepository: { create: async (...args) => { created = args; return { id: 4, title: "Projekt" }; } },
            trx: subjectTrx({ id: 2, user_id: 7 })
        })
    });
    const input = { subject_id: 2, title: "Projekt" };
    assert.deepEqual(await service.createTask(input, 7), { id: 4, title: "Projekt" });
    assert.deepEqual(created, [input, 7]);
});

test("tasks.createTask rejects a subject owned by another user", async () => {
    const service = createTasksService({
        runInTransaction: work => work({
            tasksRepository: { create: async () => assert.fail("create must not be called") },
            trx: subjectTrx(null)
        })
    });
    await assert.rejects(service.createTask({ subject_id: 2, title: "Projekt" }, 7), NotFoundError);
});

test("grades.createGrade rejects a subject not owned by the current user", async () => {
    const service = createGradesService({
        runInTransaction: work => work({
            gradesRepository: { create: async () => assert.fail("create must not be called") },
            trx: subjectTrx(null)
        })
    });
    await assert.rejects(service.createGrade({ subject_id: 2, grade: 5 }, 7), NotFoundError);
});
