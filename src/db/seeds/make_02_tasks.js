
exports.seed = async function (knex) {
    // Usunięcie wcześniejszych danych testowych
    await knex('tasks').del();

    // Dodanie przykładowych zadań
await knex('tasks').insert([
        {
            subject_id: 1, // np. Matematyka
            title: 'Zadanie z matematyki',
            description: 'Rozwiązać zadania ze strony 45',
            due_date: '2026-11-16 18:00:00',
            type: 'HOMEWORK',
            status: 'PENDING'
        },
        {
            subject_id: 2, // np. Informatyka / Bazy danych
            title: 'Sprawdzian z informatyki',
            description: 'Przygotować się z baz danych i SQL',
            due_date: '2026-11-18 10:00:00',
            type: 'TEST',
            status: 'PENDING'
        },
        {
            subject_id: 3, // np. Język angielski
            title: 'Kartkówka z angielskiego',
            description: 'Powtórzyć słownictwo z rozdziału 3',
            due_date: '2026-11-17 09:00:00',
            type: 'OTHER',
            status: 'IN_PROGRESS'
        },
        {
            subject_id: 3, // np. Fizyka
            title: 'Projekt z fizyki',
            description: 'Przygotować prezentację o energii',
            due_date: '2026-11-20 20:00:00',
            type: 'HOMEWORK',
            status: 'COMPLETED'
        },
        {
            subject_id: 1, // np. Inne zadanie z matematyki / polskiego
            title: 'Przeczytać lekturę',
            description: 'Przeczytać pierwsze 50 stron',
            due_date: '2026-11-22 15:00:00',
            type: 'OTHER',
            status: 'PENDING'
        }
    ]);
};
