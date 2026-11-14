const db = require("./db/knex");
const { createApp } = require("./app");

const { createKnexUnitOfWork: createTaskUoW } = require("./modules/tasks/tasks.repository.knex");
const { createKnexUnitOfWork: createSubjectUoW } = require("./modules/subjects/subjects.repository.knex");

const app = createApp({
    tasksRunInTransaction: createTaskUoW(db).runInTransaction,
    subjectsRunInTransaction: createSubjectWOrkHelper = createSubjectUoW(db).runInTransaction
});

app.listen(3002, () => console.log("Server running on http://localhost:3002"));