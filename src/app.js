const express = require("express");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Moduł Tasks
const { createTasksService } = require("./modules/tasks/tasks.service");
const { createTasksController } = require("./modules/tasks/tasks.controller");
const { createTasksRouter } = require("./modules/tasks/tasks.routes");

// Moduł Subjects
const { createSubjectsService } = require("./modules/subjects/subjects.service");
const { createSubjectsController } = require("./modules/subjects/subjects.controller");
const { createSubjectsRouter } = require("./modules/subjects/subjects.routes");

// Przyjmujemy obiekt z dwoma różnymi funkcjami transakcyjnymi
function createApp({ tasksRunInTransaction, subjectsRunInTransaction }) {
    const app = express();

    app.use(requestLogger);
    app.use(express.json());

    // Inicjalizacja modułu Tasks
    const tasksService = createTasksService({ runInTransaction: tasksRunInTransaction });
    app.use("/api/tasks", createTasksRouter(createTasksController(tasksService)));

    // Inicjalizacja modułu Subjects
    const subjectsService = createSubjectsService({ runInTransaction: subjectsRunInTransaction });
    app.use("/api/subjects", createSubjectsRouter(createSubjectsController(subjectsService)));

    // Obsługa błędów i nieznanych tras
    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };