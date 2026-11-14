const config = require("./config");
const db = require("./db/knex");
const { createApp } = require("./app");

const { createUsersRepository } = require("./modules/auth/users.repository.knex");
const { createKnexUnitOfWork: createTaskUoW } = require("./modules/tasks/tasks.repository.knex");
const { createKnexUnitOfWork: createSubjectUoW } = require("./modules/subjects/subjects.repository.knex");
const { createKnexUnitOfWork: createGradeUoW } = require("./modules/grades/grades.repository.knex");

const app = createApp({
    config,
    tasksRunInTransaction: createTaskUoW(db).runInTransaction,
    subjectsRunInTransaction: createSubjectUoW(db).runInTransaction,
    gradesRunInTransaction: createGradeUoW(db).runInTransaction,
    usersRepository: createUsersRepository(db)
});

app.listen(config.PORT, () => console.log(`Server running on http://localhost:${config.PORT}`));