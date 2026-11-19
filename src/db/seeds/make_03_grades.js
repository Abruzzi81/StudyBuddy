exports.seed = async function (knex) {
    await knex("grades").del();

    const subjects = await knex("subjects").select("id", "user_id").orderBy("id");
    const ownerBySubject = new Map(subjects.map(subject => [subject.id, subject.user_id]));

    const gradeRows = [
        { subject_id: 1, grade: 5.0, weight: 2.0, description: "Kolokwium z aplikacji internetowych", grade_date: "2026-06-01" },
        { subject_id: 1, grade: 4.5, weight: 1.0, description: "Projekt semestralny", grade_date: "2026-06-10" },
        { subject_id: 2, grade: 4.0, weight: 3.0, description: "Egzamin z baz danych", grade_date: "2026-06-15" }
    ];

    await knex("grades").insert(gradeRows.map(grade => ({
        ...grade,
        user_id: ownerBySubject.get(grade.subject_id)
    })));
};
