const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapiDocument = require("./docs/openapi.json");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const authenticate = require("./middleware/authenticate");

const { createAuthService } = require("./modules/auth/auth.service");
const { createAuthRouter } = require("./modules/auth/auth.routes");

// Moduł Tasks
const { createTasksService } = require("./modules/tasks/tasks.service");
const { createTasksController } = require("./modules/tasks/tasks.controller");
const { createTasksRouter } = require("./modules/tasks/tasks.routes");

// Moduł Subjects
const { createSubjectsService } = require("./modules/subjects/subjects.service");
const { createSubjectsController } = require("./modules/subjects/subjects.controller");
const { createSubjectsRouter } = require("./modules/subjects/subjects.routes");

// Moduł Grades
const { createGradesService } = require("./modules/grades/grades.service");
const { createGradesController } = require("./modules/grades/grades.controller");
const { createGradesRouter } = require("./modules/grades/grades.routes");

function createApp({ config, tasksRunInTransaction, subjectsRunInTransaction, gradesRunInTransaction, usersRepository }) {
    const app = express();

    app.use(requestLogger);
    app.use(express.json());

    const requireAuth = authenticate(config.JWT_SECRET);

    const authService = createAuthService({
        usersRepository,
        jwtSecret: config.JWT_SECRET,
        jwtExpiresIn: config.JWT_EXPIRES_IN
    });

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

    app.use("/api/auth", createAuthRouter({
        authService, 
        usersRepository,
        authenticate: requireAuth
    }));

    // Inicjalizacja modułu Tasks
    const tasksService = createTasksService({ runInTransaction: tasksRunInTransaction });
    app.use("/api/tasks", createTasksRouter(createTasksController(tasksService)));

    // Inicjalizacja modułu Subjects
    const subjectsService = createSubjectsService({ runInTransaction: subjectsRunInTransaction });
    app.use("/api/subjects", createSubjectsRouter(createSubjectsController(subjectsService)));

    // Inicjalizacja modułu Grades
    const gradesService = createGradesService({ runInTransaction: gradesRunInTransaction });
    app.use("/api/grades", createGradesRouter(createGradesController(gradesService)));

    // Obsługa błędów i nieznanych tras
    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };