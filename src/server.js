const db = require("./db/knex");
const { createApp } = require("./app");

const { createKnexUnitOfWork: createTaskUoW } = require("./modules/tasks/tasks.repository.knex");
const { createKnexUnitOfWork: createSubjectUoW } = require("./modules/subjects/subjects.repository.knex");
const { createKnexUnitOfWork: createGradeUoW } = require("./modules/grades/grades.repository.knex"); // Opcjonalnie dla grades

const app = createApp({
    tasksRunInTransaction: createTaskUoW(db).runInTransaction,
    subjectsRunInTransaction: createSubjectUoW(db).runInTransaction,
    gradesRunInTransaction: createGradeUoW(db).runInTransaction // Opcjonalnie dla grades
});

app.listen(3002, () => console.log("Server running on http://localhost:3002"));