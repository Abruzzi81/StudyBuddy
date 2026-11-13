const { createApp } = require("./app");
const { createInMemoryTasksRepository } = require("./modules/tasks/tasks.repository.memory");

const tasksRepository = createInMemoryTasksRepository({
    tasks: [
        {
            "id": 1,
            "title": "Projekt z matematyki",
            "description": "Przygotować prezentację na temat funkcji kwadratowych.",
            "due_date": "2026-06-15T12:00:00Z",
            "type": "Projekt",
            "createdAt": "2026-06-10T08:30:00Z",
            "status": "W toku"
        },
        {
            "id": 2,
            "title": "Lektura z języka polskiego",
            "description": "Przeczytać I i II akt 'Dziadów' cz. II.",
            "due_date": "2026-06-18T23:59:00Z",
            "type": "Zadanie domowe",
            "createdAt": "2026-06-11T10:00:00Z",
            "status": "Do zrobienia"
        },
        {
            "id": 3,
            "title": "Kartkówka z historii",
            "description": "Powtórzyć materiał o wybuchu II wojny światowej.",
            "due_date": "2026-06-14T09:15:00Z",
            "type": "Kartkówka",
            "createdAt": "2026-06-08T14:20:00Z",
            "status": "Zrobione"
        },
        {
            "id": 4,
            "title": "Sprawdzian z biologii",
            "description": "Układ krążenia i układ oddechowy człowieka.",
            "due_date": "2026-06-22T10:45:00Z",
            "type": "Sprawdzian",
            "createdAt": "2026-06-12T16:00:00Z",
            "status": "Do zrobienia"
        },
        {
            "id": 5,
            "title": "Zadanie z programowania",
            "description": "Stworzyć prosty formularz rejestracji w Node.js i Express.",
            "due_date": "2026-06-20T18:00:00Z",
            "type": "Projekt",
            "createdAt": "2026-06-13T11:10:00Z",
            "status": "W toku"
        }
    ]
});

const app = createApp({ tasksRepository });

app.listen(3002, () => console.log("Server running on http://localhost:3002"));