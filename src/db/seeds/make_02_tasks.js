exports.seed = async function (knex) {
    await knex("tasks").del();

    const subjects = await knex("subjects").select("id", "user_id").orderBy("id");
    const ownerBySubject = new Map(subjects.map(subject => [subject.id, subject.user_id]));
    const taskRows = [
        { subject_id: 1, title: "Zadanie z matematyki", description: "Rozwiązać zadania ze strony 45", due_date: "2026-11-16 18:00:00", type: "HOMEWORK", status: "PENDING" },
        { subject_id: 2, title: "Sprawdzian z informatyki", description: "Przygotować się z baz danych i SQL", due_date: "2026-11-18 10:00:00", type: "TEST", status: "PENDING" },
        { subject_id: 3, title: "Kartkówka z angielskiego", description: "Powtórzyć słownictwo z rozdziału 3", due_date: "2026-11-17 09:00:00", type: "OTHER", status: "IN_PROGRESS" },
        { subject_id: 3, title: "Projekt z fizyki", description: "Przygotować prezentację o energii", due_date: "2026-11-20 20:00:00", type: "HOMEWORK", status: "COMPLETED" },
        { subject_id: 1, title: "Przeczytać lekturę", description: "Przeczytać pierwsze 50 stron", due_date: "2026-11-22 15:00:00", type: "OTHER", status: "PENDING" }
    ];

    await knex("tasks").insert(taskRows.map(task => ({
        ...task,
        user_id: ownerBySubject.get(task.subject_id)
    })));
};
