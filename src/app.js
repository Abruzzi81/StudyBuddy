const express = require("express");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler")

const { createTasksService } = require("./modules/tasks/tasks.service");
const { createTasksController } = require("./modules/tasks/tasks.controller");
const { createTasksRouter } = require("./modules/tasks/tasks.routes");


function createApp( {tasksRepository} ) {
    const app = express();

    app.use(requestLogger);
    app.use(express.json());

    const tasksService = createTasksService({ tasksRepository });
    const tasksController = createTasksController(tasksService);
    app.use("/api/tasks", createTasksRouter(tasksController));
    

    app.use(notFound);
    app.use(errorHandler);

    return app;
}


module.exports = { createApp };