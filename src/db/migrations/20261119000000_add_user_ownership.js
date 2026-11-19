
exports.up = async function (knex) {
    const fallbackUser = await knex("users")
        .where({ role: "USER" })
        .orderBy("id", "asc")
        .first();

    if (!fallbackUser) {
        throw new Error(
            "Nie można przypisać właścicieli: tabela users nie zawiera użytkownika z rolą USER."
        );
    }

    // Uzupełnienie właściciela istniejących przedmiotów.
    await knex("subjects")
        .whereNull("user_id")
        .update({ user_id: fallbackUser.id });

    await knex.schema.alterTable("subjects", table => {
        table.integer("user_id").unsigned().notNullable().alter();
        table.foreign("user_id", "subjects_user_id_fk")
            .references("id").inTable("users").onDelete("CASCADE");
    });

    // Bezpośredni właściciel zadań.
    await knex.schema.alterTable("tasks", table => {
        table.integer("user_id").unsigned().nullable();
    });

    await knex("tasks")
        .whereNull("user_id")
        .update({ user_id: fallbackUser.id });

    // Synchronizacja właściciela zadań z właścicielem przedmiotu.
    await knex.raw(`
        UPDATE tasks
        SET user_id = subjects.user_id
        FROM subjects
        WHERE tasks.subject_id = subjects.id
    `);

    await knex.schema.alterTable("tasks", table => {
        table.integer("user_id").unsigned().notNullable().alter();
        table.foreign("user_id", "tasks_user_id_fk")
            .references("id").inTable("users").onDelete("CASCADE");
    });

    await knex.schema.alterTable("grades", table => {
        table.integer("user_id").unsigned().nullable();
    });

    // Przypisanie ocen do właścicieli przedmiotów.
    await knex.raw(`
        UPDATE grades
        SET user_id = subjects.user_id
        FROM subjects
        WHERE grades.subject_id = subjects.id
    `);

    await knex.schema.alterTable("grades", table => {
        table.integer("user_id").unsigned().notNullable().alter();
        table.foreign("user_id", "grades_user_id_fk")
            .references("id").inTable("users").onDelete("CASCADE");
        table.foreign("subject_id", "grades_subject_id_fk")
            .references("id").inTable("subjects").onDelete("CASCADE");
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable("grades", table => {
        table.dropForeign("user_id", "grades_user_id_fk");
        table.dropForeign("subject_id", "grades_subject_id_fk");
        table.dropColumn("user_id");
    });

    await knex.schema.alterTable("tasks", table => {
        table.dropForeign("user_id", "tasks_user_id_fk");
        table.dropColumn("user_id");
    });

    await knex.schema.alterTable("subjects", table => {
        table.dropForeign("user_id", "subjects_user_id_fk");
        table.integer("user_id").nullable().alter();
    });
};
