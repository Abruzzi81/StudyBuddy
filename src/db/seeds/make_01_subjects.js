exports.seed = async function (knex) {
    await knex("subjects").del();

    const student = await knex("users")
        .where({ email: "student@studybuddy.pl" })
        .first();

    if (!student) throw new Error("Uruchom najpierw seed użytkowników.");

    await knex("subjects").insert([
        { name: "Technologie Webowe i Aplikacje Internetowe", teacher: "Dr inż. Kowalski", user_id: student.id },
        { name: "Bazy Danych", teacher: "Prof. Nowak", user_id: student.id },
        { name: "Inżynieria Oprogramowania", teacher: "Dr Wiśniewska", user_id: student.id }
    ]);
};
