const db = require("./db/knex");
const { createApp } = require("./app");
const { createKnexUnitOfWork } = require("./modules/tasks/tasks.repository.knex");

const app = createApp(createKnexUnitOfWork(db));

app.listen(3002, () => console.log("Server running on http://localhost:3002"));